import { CommonModule } from '@angular/common';
import { Component, HostListener, NO_ERRORS_SCHEMA, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { computed, signal } from '@angular/core';
import { PropertyService } from '../../../services/property.service';
import { environment } from '../../../../environments/environment';
import { ChatHistoryService } from '../../../services/chathistory.service';
import { ChatHistory } from '../../../models/chathistory.model';
import { Property } from '../../../models/property.model';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  images?: string[];
  room?: string;
  meta?: string[];
  style?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('scrollArea') scrollArea?: ElementRef;
  @ViewChild('textareaRef') textareaRef?: ElementRef;

  // UI state
  previewUrls: string[] = [];
  isUploading = false;
  errorMessage: any;
  sidebarCollapsed = false;
  mobileSidebarOpen = false;
  showPopup = false;
  showImagePopup = false;
  hasActiveConversation = false;
  conversationLoaded = false;

  // Thumbnails & compare
  compareThumbnails = signal<string[]>([]);
  visibleThumbnails: string[] = [];
  thumbnailBatch = 10;
  numCompareBoxes = 2;
  compareBoxes: (string | null)[] = [];

  // Signals
  pendingImages = signal<string[]>([]);
  chosenMeta = signal<string[]>([]);
  messages = signal<ChatMessage[]>([]);
  activeConversationId = signal<number | null>(null);
  conversations = signal<{ id: string; title: string; }[]>([
    { id: 'c1', title: 'Sample: Bedroom Design' },
    { id: 'c2', title: 'Kitchen Renovation' }
  ]);
  recognizing = signal<boolean>(false);
  actionsOpen = signal<boolean>(false);

  // Form data
  roomModel = '';
  style = '';
  Housestyle = '';
  composerDescription = '';
  popupDescription = '';
  pendingFiles: File[] = [];
  isLoadingChat = false;

  // Tool states
  activeTool: string | null = null;
  compareMode: 'horizontal' | 'vertical' = 'horizontal';
  currentImage: string | null = null;
  currentOriginalImage: string | null = null;
  currentGeneratedImage: string | null = null;
  selectedElement = '';
  selectedTool = '';

  // Data lists
  rooms = ['Kitchen', 'Bedroom', 'Living Room', 'Bathroom', 'Dining', 'Study', 'Office', 'Garage'];
  StyleTags = ['Modern', 'Cozy', 'Luxury', 'Minimalist', 'Rustic', 'Industrial', 'Scandinavian', 'Bohemian'];
  HouseStyleTags = [
    'American', 'British', 'French', 'Italian', 'Japanese', 'Scandinavian',
    'German', 'Spanish', 'Dutch', 'Australian', 'Swiss', 'Moroccan', 'Turkish', 'Russian'
  ];
  tools = [  'Compare Version', 'Add Element'];
  elements = [
    { name: 'Add Lighting', prompt: 'Add ambient lighting fixtures to enhance the room atmosphere' },
    { name: 'Add Plants', prompt: 'Add indoor plants and greenery to bring life to the space' },
    { name: 'Add Furniture', prompt: 'Add complementary furniture pieces that match the style' },
    { name: 'Add Artwork', prompt: 'Add wall art and decorative elements to enhance the aesthetics' },
    { name: 'Add Rug', prompt: 'Add a stylish area rug that complements the room design' },
    { name: 'Add Curtains', prompt: 'Add elegant window treatments and curtains for privacy' }
  ];
  properties: Property[] = [];

  // Internal
  private recognition?: any;
  private shouldScrollToBottom = false;
  conversationsList: any[] = [];
  isLoadingProperties = false;
  userCredits: any = 0;
  showCreditPopup = false;
  currentUser: any = {};
  chatList: ChatHistory[] = [];
  newChatHistory: ChatHistory = { title: '', messages: '' };
  chatId: any;
  // ✅ ADD IT HERE (inside the class)
  dateOrder = (a: any, b: any): number => {
    const order = ['Today', 'Yesterday', 'Older'];
    return order.indexOf(a.key) - order.indexOf(b.key);
  };

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private propertyService: PropertyService,
    private chatService: ChatHistoryService,
    private cdRef: ChangeDetectorRef
  ) {
    this.loadChats();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
    // update current user & credits
    this.currentUser = this.tokenStorage.getUser();
    this.tokenStorage.credits$.subscribe(credits => {
      this.userCredits = credits;
      console.log('Credits updated:', this.userCredits);
    });
  }

  // Host clicks to close tool panels
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideToolbar = target.closest('.image-toolbar') || target.closest('.message-image');
    if (!clickedInsideToolbar && this.activeTool && !target.closest('.tool-panel')) {
      this.closeTool();
    }
  }

  // ---------- Thumbnail / Compare helpers ----------

  addCompareImage(imgUrl: string) {
    if (!imgUrl) return;

    // normalize to path (keep raw paths if backend provided)
    let raw = imgUrl;
    if (raw.startsWith(environment.backendUrl)) {
      raw = raw.replace(environment.backendUrl, '');
    }
    // ensure leading slash
    if (!raw.startsWith('/')) raw = '/' + raw;

    this.compareThumbnails.update(arr => {
      if (arr.includes(raw)) return arr;
      return [...arr, raw];
    });

    this.updateVisibleThumbnails();
  }

  removeCompareImage(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.compareThumbnails.update(arr => {
      const copy = [...arr];
      copy.splice(index, 1);
      return copy;
    });
    this.updateVisibleThumbnails();
  }

  updateVisibleThumbnails() {
    this.visibleThumbnails = this.compareThumbnails()
      .slice(0, this.thumbnailBatch)
      .map(p => this.fullUrl(p));
    // debug
    console.log('compareThumbnails raw:', this.compareThumbnails());
    console.log('visibleThumbnails:', this.visibleThumbnails);
  }

  loadMoreThumbnails() {
    this.thumbnailBatch += 10;
    this.updateVisibleThumbnails();
  }

  private fullUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (!path.startsWith('/')) path = '/' + path;
    return `${environment.backendUrl}${path}`;
  }

  // drag/drop
  onDragStart(event: DragEvent, img: string) {
    event.dataTransfer?.setData('text/plain', img);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, boxIndex: number) {
    event.preventDefault();
    const img = event.dataTransfer?.getData('text/plain');
    if (!img) return;
    if (boxIndex < this.numCompareBoxes) {
      this.compareBoxes[boxIndex] = this.fullUrl(img);
    }
  }

  // keep compareBoxes length in sync
  ngDoCheck() {
    if (this.compareBoxes.length !== this.numCompareBoxes) {
      const newBoxes: (string | null)[] = [];
      for (let i = 0; i < this.numCompareBoxes; i++) {
        newBoxes[i] = this.compareBoxes[i] || null;
      }
      this.compareBoxes = newBoxes;
    }
  }

  // ---------- Navigation ----------
  toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed; }
  toggleMobileSidebar() { this.mobileSidebarOpen = !this.mobileSidebarOpen; }
  goToProfile() { this.router.navigate(['/profile']); }

  room = computed(() => this.roomModel);

  // ---------- Chat lifecycle ----------
  newChat() {
    const id = crypto.randomUUID();
    this.hasActiveConversation = false;
    this.conversations.update(list => {
      const newList = [...list];
      newList.unshift({ id, title: 'New chat' });
      return newList;
    });
    this.activeConversationId.set(0);
    this.messages.set([]);
    this.composerDescription = '';
    this.pendingImages.set([]);
    this.pendingFiles = [];
    this.chosenMeta.set([]);
    this.roomModel = '';
    this.style = '';
    this.Housestyle = '';
    this.showPopup = true;
    this.properties = [];
  }

  openConversation(chatId: number) {
    this.chatId = chatId;
    this.activeConversationId.set(chatId);
    this.isLoadingChat = true;
    this.isLoadingProperties = true;
    this.hasActiveConversation = true;
    this.conversationLoaded = false;

    // Reset viewer state
    this.currentImage = null;
    this.currentOriginalImage = null;
    this.currentGeneratedImage = null;
    this.activeTool = null;
    this.showImagePopup = false;

    // --- Load chat history ---
    this.propertyService.getChatProperty(chatId).subscribe({
      next: (chatData: any) => {
        // Ensure messages exist and parse if needed
        const messages = chatData?.messages
          ? typeof chatData.messages === 'string'
            ? JSON.parse(chatData.messages)
            : chatData.messages
          : [];

        const parsedMessages: ChatMessage[] = messages.map((msg: any, index: number) => ({
          id: msg.id || `msg-${index}`,
          role: (msg.role as 'user' | 'assistant') || 'user',
          text: msg.content || msg.text || '',
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          images: msg.images || [],
          room: msg.room,
          style: msg.style
        }));
        this.messages.set(parsedMessages);
        this.shouldScrollToBottom = true;
        this.isLoadingChat = false;
        this.conversationLoaded = true;
      },
      error: (err) => {
        console.error('Error loading chat history:', err);
        this.messages.set([]);
        this.isLoadingChat = false;
        this.conversationLoaded = true;
      }
    });

    // --- Load properties (designs) ---
    this.propertyService.getChatProperty(chatId).subscribe({
      next: (res: any) => {
        // Ensure res is an array
        const propertiesArray = Array.isArray(res) ? res : [];

        this.properties = propertiesArray.map((p: any) => ({
          ...p,
          originalImageUrl: p.originalImageUrl || '',
          generatedImageUrl: p.generatedImageUrl || ''
        }));

        // Populate compare thumbnails
        this.compareThumbnails.update(() => {
          return this.properties
            .map(pr => pr.generatedImageUrl || pr.originalImageUrl)
            .filter(Boolean);
        });

        this.updateVisibleThumbnails();
        this.isLoadingProperties = false;
      },
      error: (err) => {
        console.error('Error loading properties:', err);
        this.properties = [];
        this.isLoadingProperties = false;
      }
    });
  }

  // ---------- Popup ----------
  openUploadPopup() { this.showPopup = true; }
  closePopup() { this.showPopup = false; }

  confirmPopup() {
    if (!this.pendingImages().length && !this.popupDescription.trim()) return;
    this.composerDescription = this.popupDescription;
    this.send();
    // clear modal state
    this.pendingImages.set([]);
    this.popupDescription = '';
    this.roomModel = '';
    this.style = '';
    this.Housestyle = '';
    this.composerDescription = '';
    this.closePopup();
  }

  // ---------- File upload ----------
  onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const files = Array.from(input.files);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      this.pendingFiles.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.pendingImages.update(arr => [...arr, String(reader.result)]);
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removePendingImage(index: number) {
    this.pendingImages.update(arr => {
      const copy = [...arr];
      copy.splice(index, 1);
      return copy;
    });
    this.pendingFiles.splice(index, 1);
  }

  // ---------- Image viewer ----------
  selectImage(img: string, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.currentImage = img;
    const msgs = this.messages();
    for (let i = msgs.length - 1; i >= 0; i--) {
      const msg = msgs[i];
      if (msg.role === 'assistant' && msg.images?.length) {
        this.currentGeneratedImage = msg.images[0];
      }
      if (msg.role === 'user' && msg.images?.length) {
        this.currentOriginalImage = msg.images[0];
        break;
      }
    }
    this.showImagePopup = true;
  }

  closeImagePopup() {
    this.showImagePopup = false;
    this.currentImage = null;
    this.activeTool = null;
  }

  // ---------- Tools ----------
  openTool(tool: string) { this.activeTool = tool; }
  closeTool() { this.activeTool = null; }
  setCompareMode(mode: 'horizontal' | 'vertical') { this.compareMode = mode; }

  async applyEraser() {
    if (!this.currentImage) return;
    const file = await this.convertImageToFile(this.currentImage, 'eraser-image.png');
    if (!file) {
      alert('Image conversion failed. Please upload a valid image first.');
      return;
    }
    this.pendingFiles = [file];
    this.closeTool();
    this.closeImagePopup();
    this.send();
  }

  async applyElement() {
    const element = this.elements.find(e => e.name === this.selectedElement);
    if (!element) return alert('Please select an element to apply.');
    const baseImagePath = this.currentImage;
    if (!baseImagePath) return alert('No image found to modify.');
    this.composerDescription = element.prompt;
    try {
      const file = await this.fetchImageAsFile(baseImagePath, 'element-image.png');
      this.pendingFiles = [file];
      this.pendingImages.set([baseImagePath]);
      this.closeTool();
      this.closeImagePopup();
      this.send();
      this.clearComposer();
    } catch (e) {
      alert('Image conversion failed. Check console.');
    }
  }

  async fetchImageAsFile(imageUrl: string, fileName: string): Promise<File> {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error('Failed to fetch image: ' + res.status);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  getElementPrompt(elementName: string): string {
    const element = this.elements.find(e => e.name === elementName);
    return element?.prompt || '';
  }

  // ---------- Voice ----------
  startVoice() {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    if (!this.recognition) {
      this.recognition = new SR();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.onresult = (event: any) => {
        let finalText = this.composerDescription || '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalText += (finalText ? ' ' : '') + res[0].transcript.trim();
          }
        }
        this.composerDescription = finalText;
      };
      this.recognition.onend = () => this.recognizing.set(false);
      this.recognition.onerror = () => this.recognizing.set(false);
    }
    this.recognizing.set(true);
    this.recognition.start();
  }

  stopVoice() {
    this.recognizing.set(false);
    this.recognition?.stop();
  }

  // ---------- Sending messages ----------
  canSend(): boolean {
    return (this.composerDescription.trim().length > 0 || this.pendingImages().length > 0) && !this.isUploading;
  }

  send() {
    // ensure currentUser/credits available
    if (this.userCredits === undefined || this.userCredits === null) this.userCredits = 0;

    if (this.userCredits > 0) {
      const text = this.composerDescription.trim();
      // if (!text || !this.pendingImages().length) return;

      // if (this.pendingFiles.length === 0 && this.pendingImages().length > 0) {
      //   alert('To generate images, please upload a valid photo first.');
      //   return;
      // }

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        text,
        images: this.pendingImages().slice(),
        timestamp: new Date(),
        room: this.roomModel || undefined,
        style: this.style || undefined
      };

      this.messages.update(list => [...list, userMsg]);
      this.shouldScrollToBottom = true;

      // if (this.pendingFiles.length > 0) {
        this.uploadToBackend(userMsg, text);
      // } else {
      //   const aiResponse: ChatMessage = {
      //     id: crypto.randomUUID(),
      //     role: 'assistant',
      //     text: 'To generate images, please upload a photo first. You can click the settings icon to upload images.',
      //     timestamp: new Date()
      //   };
      //   this.messages.update(list => [...list, aiResponse]);
      //   this.shouldScrollToBottom = true;
      //   this.clearComposer();
      // }
    } else {
      this.openCreditPopup();
    }
  }

  openCreditPopup() { this.showCreditPopup = true; }
  closeCreditPopup() { this.showCreditPopup = false; }

  generateChatTitle(
    description?: string,
    propertyType?: string,
    style?: string
  ): string {

    const parts: string[] = [];

    // 1️⃣ Style
    parts.push(style && style.trim()
      ? this.capitalize(style)
      : 'Modern'
    );

    // 2️⃣ Room / Property
    const room =
      propertyType?.trim() ||
      this.detectRoomFromDescription(description || '') ||
      'Interior';

    parts.push(room);

    // 3️⃣ Random qualifier
    const qualifier = this.getRandomQualifier(description);
    if (qualifier) {
      parts.push(qualifier);
    }

    // 4️⃣ Ensure 4–5 words
    if (parts.length < 4) {
      parts.push('Design');
    }

    return parts.slice(0, 5).join(' ');
  }

  getRandomQualifier(desc?: string): string | null {
    if (!desc) return null;

    const d = desc.toLowerCase();

    const qualifiers: { [key: string]: string[] } = {

      /* LIGHTING */
      light: [
        'Sunlit Space',
        'Bright Interior',
        'Natural Light Focus',
        'Soft Daylight Mood'
      ],
      lighting: [
        'Balanced Lighting',
        'Ambient Light Design',
        'Soft Light Interior'
      ],

      /* MATERIALS */
      wood: [
        'Warm Wood Accents',
        'Natural Wood Finish',
        'Wood Texture Focus'
      ],
      marble: [
        'Marble Finish',
        'Premium Stone Look',
        'Polished Marble Style'
      ],
      fabric: [
        'Soft Fabric Textures',
        'Textile Rich Interior'
      ],

      /* COLORS */
      white: [
        'Neutral Tones',
        'Soft White Palette',
        'Clean Color Theme'
      ],
      beige: [
        'Warm Neutral Shades',
        'Earthy Color Palette'
      ],
      dark: [
        'Moody Color Theme',
        'Deep Tone Interior'
      ],

      /* LAYOUT */
      open: [
        'Open Layout',
        'Spacious Planning',
        'Airy Interior Flow'
      ],
      compact: [
        'Smart Space Planning',
        'Compact Layout Design'
      ],

      /* STYLE & MOOD */
      cozy: [
        'Cozy Atmosphere',
        'Warm And Inviting',
        'Comfort Living Style'
      ],
      luxury: [
        'Luxury Finish',
        'Premium Interior Look',
        'High-End Styling'
      ],
      minimal: [
        'Minimal Look',
        'Clean Design Style',
        'Clutter-Free Space'
      ],
      modern: [
        'Contemporary Design',
        'Modern Aesthetic'
      ],

      /* REAL ESTATE STAGING */
      staged: [
        'Real Estate Ready',
        'Professionally Staged',
        'Market-Ready Design'
      ],

      /* QUALITY */
      realistic: [
        'Photorealistic Finish',
        'High Detail Render'
      ]
    };

    for (const key in qualifiers) {
      if (d.includes(key)) {
        return this.pickRandom(qualifiers[key]);
      }
    }

    return null;
  }


  detectRoomFromDescription(desc: string): string | null {
    const d = desc.toLowerCase();

    if (d.includes('living')) return 'Living Room';
    if (d.includes('bed')) return 'Bedroom';
    if (d.includes('kitchen')) return 'Kitchen';
    if (d.includes('bath')) return 'Bathroom';
    if (d.includes('office')) return 'Home Office';

    return null;
  }
  pickRandom(list: string[]): string {
    return list[Math.floor(Math.random() * list.length)];
  }


  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  generateEnhancementType(
    description?: string,
    propertyType?: string,
    style?: string
  ): string {

    const s = style && style.trim()
      ? style.trim().toLowerCase()
      : 'modern';

    let room: any = propertyType;

    if (!room && description) {
      room = this.detectRoomFromDescription(description);
    }

    const r = room
      ? room.toLowerCase().replace(/\s+/g, '_')
      : 'interior';

    return `${s}_${r}`;
  }




  private async uploadToBackend(userMsg: ChatMessage, text: string) {
    this.isUploading = true;

    // Convert image file → base64 string
    const base64File = await this.convertFileToBase64(this.pendingFiles[0]);

    const autoGeneratedTitle = this.generateChatTitle(
      this.composerDescription,
      this.roomModel,
      this.style
    );
    const autoEnhancementType = this.generateEnhancementType(
      this.composerDescription,
      this.roomModel,
      this.style
    );

    const chatPayload: ChatHistory = {
      title: autoGeneratedTitle,
      messages: JSON.stringify([{ role: 'user', content: this.composerDescription }])
    };

    if (!this.chatId) {
      this.chatService.createChat(chatPayload).subscribe({
        next: (data: any) => {
          this.chatId = data.id;
          this.activeConversationId.set(data.id);

          const jsonPayload = {
            userId: this.currentUser.id,
            title: autoGeneratedTitle || 'Image modification',
            description: text || 'AI generated design',
            propertyType: this.roomModel || 'General',
            enhancementStyle: this.style || 'modern',
            enhancementType: autoEnhancementType || 'modern',
            chatHistoryId: data.id,
            file: base64File            // Base64 instead of binary
          };

          this.sendJsonToBackend(jsonPayload, userMsg);
        },
        error: err => console.error('Error creating chat:', err)
      });
    } else {
      const jsonPayload = {
        userId: this.currentUser.id,
        title: autoGeneratedTitle || 'Image modification',
        description: text || 'AI generated design',
        propertyType: this.roomModel || 'General',
        enhancementStyle: this.style || 'modern',
        enhancementType: autoEnhancementType || 'modern',
        chatHistoryId: this.chatId,
        file: base64File
      };

      this.sendJsonToBackend(jsonPayload, userMsg);
    }
  }
  private sendJsonToBackend(jsonPayload: any, userMsg: ChatMessage) {
    this.propertyService.uploadPropertyAsync(jsonPayload).subscribe({
      next: (res: any) => {
        const jobId = res.jobId;
        this.pollUploadStatus(jobId, userMsg);
      },
      error: err => {
        this.isUploading = false;
        this.errorMessage = err?.error?.message || 'Upload failed.';
      }
    });
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // returns data:*/*;base64,xxxx
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }


  pollUploadStatus(jobId: string, userMsg: ChatMessage) {
    const interval = setInterval(() => {
      this.propertyService.getUploadStatus(jobId).subscribe({
        next: (job: any) => {

          if (job.status === 'PROCESSING' || job.status === 'PENDING') {
            console.log("Still processing...");
            return;
          }

          clearInterval(interval);

          if (job.status === 'FAILED') {
            this.isUploading = false;
            this.errorMessage = job.errorMessage || 'AI Processing Failed';
            this.resetAfterUploadError(userMsg, job.errorMessage);
            return;
          }

          if (job.status === 'COMPLETED') {
            this.fetchCompletedProperty(job.propertyId, userMsg);
          }
        },
        error: err => {
          clearInterval(interval);
          console.error('Polling error:', err);
        }
      });
    }, 3000); // Poll every 3 seconds
  }

  fetchCompletedProperty(id: number, userMsg: ChatMessage) {
    this.propertyService.getProperty(id).subscribe({
      next: (res: any) => {
        this.loadChats();
        this.isUploading = false;

        // const baseUrl = environment.backendUrl;
        // const originalUrl = `${baseUrl}${res.originalImageUrl}`;
        // const generatedUrl = `${baseUrl}${res.generatedImageUrl}`;
        const originalUrl = res.originalImageUrl;
        const generatedUrl = res.generatedImageUrl;

        // show images
        this.messages.update(list =>
          list.map(msg => msg.id === userMsg.id ? { ...msg, images: [originalUrl] } : msg)
        );

        // AI reply
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: '✨ Your AI generated image is ready!',
          images: [generatedUrl],
          timestamp: new Date()
        };

        this.messages.update(list => [...list, aiMsg]);
        this.shouldScrollToBottom = true;
        this.clearComposer();
      },
      error: () => {
        this.errorMessage = "Couldn't fetch property after completion.";
      }
    });
  }


  private resetAfterUploadError(userMsg: ChatMessage, message: string) {
    this.composerDescription = '';
    this.pendingImages.set([]);
    this.pendingFiles = [];
    this.actionsOpen.set(false);

    const errorMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: `❌ Error: ${message}`,
      timestamp: new Date()
    };
    this.messages.update(list => [...list, errorMsg]);
    this.shouldScrollToBottom = true;
    this.clearComposer();
  }

  private clearComposer() {
    this.composerDescription = '';
    this.popupDescription = '';
    this.pendingImages.set([]);
    this.pendingFiles = [];
    this.actionsOpen.set(false);
    this.roomModel = '';
    this.style = '';
    this.Housestyle = '';
    if (this.textareaRef?.nativeElement) {
      this.textareaRef.nativeElement.value = '';
      this.textareaRef.nativeElement.style.height = 'auto';
    }
    this.cdRef.detectChanges();
    setTimeout(() => this.cdRef.detectChanges(), 10);
  }

  // image utilities

  private async convertImageToFile(image: string, filename: string): Promise<File | null> {
    try {
      if (image.startsWith('data:')) {
        const arr = image.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
      } else if (image.startsWith('http')) {
        const response = await fetch(image);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
      } else {
        console.error('Invalid image string:', image);
        return null;
      }
    } catch (err) {
      console.error('Error converting image to file:', err);
      return null;
    }
  }

  // private async convertBase64ToFile(base64: string, filename: string): Promise<File | null> {
  //   try {
  //     if (!base64.startsWith('data:')) return null;
  //     const arr = base64.split(',');
  //     const mimeMatch = arr[0].match(/:(.*?);/);
  //     if (!mimeMatch) return null;
  //     const mime = mimeMatch[1];
  //     const bstr = atob(arr[1]);
  //     let n = bstr.length;
  //     const u8arr = new Uint8Array(n);
  //     while (n--) u8arr[n] = bstr.charCodeAt(n);
  //     return new File([u8arr], filename, { type: mime });
  //   } catch (err) {
  //     console.error('Error converting base64 to file:', err);
  //     return null;
  //   }
  // }

  // Image Actions
  undo() {
    console.log('Undo action');
  }

  redo() {
    console.log('Redo action');
  }

  saveImage() {
    if (!this.currentImage) return;
    alert('Image saved to your gallery!');
  }

  likeImage() {
    if (!this.currentImage) return;
    alert('Image liked! ❤️');
  }

  dislikeImage() {
    if (!this.currentImage) return;
    alert('Feedback recorded. We will improve!');
  }

  downloadImage() {
    if (!this.currentImage) return;

    const link = document.createElement('a');
    link.href = this.currentImage;
    link.download = `beyanco-design-${Date.now()}.png`;
    link.click();
  }

  shareImage() {
    if (!this.currentImage) return;

    if (navigator.share) {
      navigator.share({
        title: 'Check out this design!',
        text: 'AI-generated interior design from Beyanco',
        url: this.currentImage
      }).catch((err: any) => console.error('Share failed:', err));
    } else {
      navigator.clipboard.writeText(this.currentImage);
      alert('Image URL copied to clipboard!');
    }
  }
  trackById(_: number, item: any): string { return item.id; }

  private scrollToBottom() {
    if (this.scrollArea) {
      try {
        this.scrollArea.nativeElement.scrollTop = this.scrollArea.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll error:', err);
      }
    }
  }

  groupedConversations: { [key: string]: any[] } = {};

  loadChats() {
    this.chatService.getUserChats().subscribe({
      next: (data) => {
        this.conversationsList = data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.groupChatsByDate(this.conversationsList);
      },
      error: (err) => console.error('Error loading chats:', err)
    });
  }

  groupChatsByDate(chats: any[]) {
    this.groupedConversations = {};

    chats.forEach(chat => {
      const dateKey = this.getDateLabel(new Date(chat.createdAt));

      if (!this.groupedConversations[dateKey]) {
        this.groupedConversations[dateKey] = [];
      }

      this.groupedConversations[dateKey].push(chat);
    });
  }

  getDateLabel(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (this.isSameDate(date, today)) return 'Today';
    if (this.isSameDate(date, yesterday)) return 'Yesterday';

    return 'Older';
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
  onEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

}
