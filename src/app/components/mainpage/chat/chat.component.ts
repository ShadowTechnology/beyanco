import { CommonModule } from '@angular/common';
import { Component, HostListener, NO_ERRORS_SCHEMA, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
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
  imports: [CommonModule, MatIconModule, FormsModule],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('scrollArea') scrollArea?: ElementRef;
  @ViewChild('textareaRef') textareaRef?: ElementRef;
  previewUrls: string[] = [];
  isUploading: boolean = false;
  errorMessage: any;
  sidebarCollapsed = false;
  mobileSidebarOpen = false;
  showPopup = false;
  showImagePopup = false;

  // ✅ Fixed: Properly typed signals
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

  // Tool states
  activeTool: string | null = null;
  compareMode: 'horizontal' | 'vertical' = 'horizontal';
  currentImage: string | null = null;
  currentOriginalImage: string | null = null;
  currentGeneratedImage: string | null = null;
  selectedElement = '';
  selectedTool = 'Magic Eraser';

  // Data
  rooms = ['Kitchen', 'Bedroom', 'Living Room', 'Bathroom', 'Dining', 'Study', 'Office', 'Garage'];
  StyleTags = ['Modern', 'Cozy', 'Luxury', 'Minimalist', 'Rustic', 'Industrial', 'Scandinavian', 'Bohemian'];
  HouseStyleTags = [
    'American', 'British', 'French', 'Italian', 'Japanese', 'Scandinavian',
    'German', 'Spanish', 'Dutch', 'Australian', 'Swiss', 'Moroccan', 'Turkish', 'Russian'
  ];
  tools = ['Magic Eraser', 'Compare Version', 'Add Element'];
  elements = [
    { name: 'Add Lighting', prompt: 'Add ambient lighting fixtures to enhance the room atmosphere' },
    { name: 'Add Plants', prompt: 'Add indoor plants and greenery to bring life to the space' },
    { name: 'Add Furniture', prompt: 'Add complementary furniture pieces that match the style' },
    { name: 'Add Artwork', prompt: 'Add wall art and decorative elements to enhance the aesthetics' },
    { name: 'Add Rug', prompt: 'Add a stylish area rug that complements the room design' },
    { name: 'Add Curtains', prompt: 'Add elegant window treatments and curtains for privacy' }
  ];
  properties: Property[] = [];

  private recognition?: any;
  private shouldScrollToBottom = false;
  conversationsList: any[] = [];
  isLoadingProperties = false;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private propertyService: PropertyService,
    private chatService: ChatHistoryService
  ) {
    this.loadChats();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
    this.currentUser = this.tokenStorage.getUser();
    // this.loadChats();
  }

  // Lifecycle & Event Handlers
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideToolbar = target.closest('.image-toolbar') || target.closest('.message-image');

    if (!clickedInsideToolbar && this.activeTool && !target.closest('.tool-panel')) {
      this.closeTool();
    }
  }

  onEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  // Navigation
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar() {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  room = computed(() => this.roomModel);
  currentUser: any = {};
  chatList: ChatHistory[] = [];
  newChatHistory: ChatHistory = { title: '', messages: '' };

  newChat() {
    const id = crypto.randomUUID();
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
  }

  openConversation(chatId: number) {
  this.activeConversationId.set(chatId);
  this.isLoadingProperties = true;

  this.propertyService.getChatProperty(chatId).subscribe(
  (res: any) => {
    this.properties = res;
    this.isLoadingProperties = false;
  },
  (err) => {
    console.error('Error loading properties:', err);
    this.isLoadingProperties = false;
  }
);

}




  // Popup Management
  openUploadPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
  confirmPopup() {
    if (!this.pendingImages().length && !this.popupDescription.trim()) return;

    this.composerDescription = this.popupDescription;

    // ✅ Optional: automatically send
    this.send();

    // ✅ Clear the modal state
    this.pendingImages.set([]);
    this.popupDescription = '';
    this.roomModel = '';
    this.style = '';
    this.Housestyle = '';
    this.composerDescription = '';

    this.closePopup();
  }

  // File Upload
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

  // Image Management
  selectImage(img: string, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.currentImage = img;

    // Find original and generated images
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

  // Tool Functions
  openTool(tool: string) {
    this.activeTool = tool;
  }

  closeTool() {
    this.activeTool = null;
  }

  setCompareMode(mode: 'horizontal' | 'vertical') {
    this.compareMode = mode;
  }

  async applyEraser() {
    if (!this.currentImage) return;

    this.composerDescription = 'Remove unwanted objects and clean up the image using AI magic eraser';
    this.pendingImages.set([this.currentImage]);

    const file = await this.convertBase64ToFile(this.currentImage, 'eraser-image.png');
    this.pendingFiles = [file];

    this.closeTool();
    this.closeImagePopup();

    this.send(); // ✅ call immediately
  }

  async applyElement() {
    const element = this.elements.find(e => e.name === this.selectedElement);
    if (!element || !this.currentGeneratedImage && !this.currentOriginalImage) return;

    this.composerDescription = element.prompt;
    let file: any;
    if (this.currentGeneratedImage) {
      this.pendingImages.set([this.currentGeneratedImage]);
      file = await this.convertBase64ToFile(this.currentGeneratedImage, 'element-image.png');
    } else if (this.currentOriginalImage) {
      this.pendingImages.set([this.currentOriginalImage]);
      file = await this.convertBase64ToFile(this.currentOriginalImage, 'element-image.png');
    }


    // Convert base64 to File
    // const file = await this.convertBase64ToFile(this.currentGeneratedImage, 'element-image.png');
    this.pendingFiles = [file];

    // this.closeTool();
    // this.closeImagePopup();

    // Call send() immediately, no setTimeout
    // this.send();
  }



  getElementPrompt(elementName: string): string {
    const element = this.elements.find(e => e.name === elementName);
    return element?.prompt || '';
  }

  // Voice Recognition
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

  // Message Sending
  canSend(): boolean {
    return (this.composerDescription.trim().length > 0 || this.pendingImages().length > 0) && !this.isUploading;
  }

  send() {
    const text = this.composerDescription.trim();

    if (!text && !this.pendingImages().length) {
      return;
    }

    // Create user message
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

    // Upload to backend if files exist
    if (this.pendingFiles.length > 0) {
      this.uploadToBackend(userMsg, text);
    } else {
      // Text-only message
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'To generate images, please upload a photo first. You can click the settings icon to upload images.',
        timestamp: new Date()
      };

      this.messages.update(list => [...list, aiResponse]);
      this.shouldScrollToBottom = true;
      this.clearComposer();
    }
  }

  private uploadToBackend(userMsg: ChatMessage, text: string) {
    const formData = new FormData();
    formData.append('title', text || 'Image modification');
    formData.append('description', text || 'AI generated design');
    formData.append('propertyType', this.roomModel || 'General');
    formData.append('enhancementStyle', this.style || 'modern');
    // formData.append('chatHistoryId', this.activeConversationId?.toString() || '');

    this.pendingFiles.forEach((file: File, idx: number) => {
      formData.append('file', file, file.name || `image-${idx}.png`);
    });

    this.isUploading = true;

    // ✅ Generate a natural chat title
    const autoGeneratedTitle = this.generateChatTitle(
      this.composerDescription,
      this.roomModel,
      this.style
    );

    // Prepare chat payload
    const chatPayload: ChatHistory = {
      title: autoGeneratedTitle,
      messages: JSON.stringify([
        { role: 'user', content: this.composerDescription }
      ])
    };

    console.log('Prepared chat payload:', chatPayload);
    console.log('Uploading files (FormData content):');
    for (const pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    // Save chat history
    this.chatService.createChat(chatPayload).subscribe({
      next: (data: any) => {
        console.log('Chat created:', data);
        this.chatList.unshift(data); // add to top of list
        this.newChatHistory = { title: '', messages: '' }; // reset form

        formData.append('chatHistoryId', data.id);

        this.activeConversationId.set(data.id);

        this.propertyService.uploadProperty(formData).subscribe({
          next: (res: any) => {
            this.isUploading = false;

            const baseUrl = environment.backendUrl;
            const originalUrl = res.originalImageUrl ? `${baseUrl}${res.originalImageUrl}` : '';
            const generatedUrl = res.generatedImageUrl ? `${baseUrl}${res.generatedImageUrl}` : '';

            // Update user message with original image URL
            if (originalUrl) {
              this.messages.update(list =>
                list.map(msg =>
                  msg.id === userMsg.id ? { ...msg, images: [originalUrl] } : msg
                )
              );
            }


            // Replace previews with uploaded image URLs
            // this.messages.update(list =>
            //   list.map(msg =>
            //     msg.id === userMsg.id
            //       ? { ...msg, images: res.generatedImageUrl ? [res.generatedImageUrl] : [] }
            //       : msg
            //   )
            // );

            // Add AI response with generated image
            if (generatedUrl) {
              const aiMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                text: '✨ Here is your AI-generated design based on your requirements.',
                images: [generatedUrl],
                timestamp: new Date()
              };
              this.messages.update(list => [...list, aiMsg]);
              this.shouldScrollToBottom = true;
              this.loadChats();
            }

            this.clearComposer();
          },
          error: (err: any) => {
            this.isUploading = false;
            this.errorMessage = err?.error?.message || 'Failed to generate image. Please try again.';
            console.error('Upload error:', err);


            // Reset composer state
            this.composerDescription = '';
            this.pendingImages.set([]);
            this.pendingFiles = [];
            this.actionsOpen.set(false);

            // Show error message
            const errorMsg: ChatMessage = {
              id: crypto.randomUUID(),
              role: 'assistant',
              text: `❌ Error: ${this.errorMessage}`,
              timestamp: new Date()
            };
            this.messages.update(list => [...list, errorMsg]);
            this.shouldScrollToBottom = true;

            this.clearComposer();
          }
        });
      },
      error: (err) => console.error('Error creating chat:', err)
    });
  }

  private generateChatTitle(description: string, propertyType?: string, style?: string): string {
    // Trim and clean up inputs
    const cleanDesc = (description || '').trim();
    const cleanType = (propertyType || '').trim();
    const cleanStyle = (style || '').trim();

    // If description already has multiple words, use it directly
    if (cleanDesc.split(' ').length >= 5) {
      return `${cleanStyle ? cleanStyle + ' ' : ''}${cleanType ? cleanType + ' ' : ''}${cleanDesc}`;
    }

    // Otherwise, auto-build a descriptive title
    let titleParts: string[] = [];

    if (cleanStyle) titleParts.push(`${cleanStyle.charAt(0).toUpperCase() + cleanStyle.slice(1)} style`);
    if (cleanType) titleParts.push(cleanType.toLowerCase());
    if (cleanDesc) titleParts.push(cleanDesc);

    const combined = titleParts.join(' ').trim();

    // Make sure it's at least ~5 words long
    if (combined.split(' ').length < 5) {
      return `Design idea for ${cleanType || 'space'} in ${cleanStyle || 'modern'} style with details: ${cleanDesc}`;
    }

    return combined;
  }


  private clearComposer() {
    this.composerDescription = '';
    this.pendingImages.set([]);
    this.pendingFiles = [];
    this.actionsOpen.set(false);
  }

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

  // Utilities
  trackById(_: number, item: any): string {
    return item.id;
  }

  private scrollToBottom() {
    if (this.scrollArea) {
      try {
        this.scrollArea.nativeElement.scrollTop = this.scrollArea.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll error:', err);
      }
    }
  }

  private async convertBase64ToFile(base64: string, filename: string): Promise<File> {
    const response = await fetch(base64);
    const blob = await response.blob();
    return new File([blob], filename, { type: 'image/png' });
  }

  loadChats() {
    this.chatService.getUserChats().subscribe({
      next: (data) => {
        // assuming backend returns an array like [{id:1, title:"..."}, ...]
        this.conversationsList = data;
        console.log('Loaded chats:', this.conversationsList);
      },
      error: (err) => console.error('Error loading chats:', err)
    });
  }

}
