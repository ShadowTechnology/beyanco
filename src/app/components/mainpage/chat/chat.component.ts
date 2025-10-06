import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { computed, effect, signal } from '@angular/core';
import { PropertyService } from '../../../services/property.service';

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
export class ChatComponent {
  previewUrls: string[] = [];
  isUploading: boolean = false;
  errorMessage: any;
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private propertyService: PropertyService,
  ) {
  }

  rooms = ['Kitchen', 'Bedroom', 'Living Room', 'Bathroom', 'Dining', 'Study'];
  showPopup = true;
  sidebarCollapsed = false;
  roomModel: string = '';
  pendingImages = signal<string[]>([]);
  pendingFiles: File[] = [];
  chosenMeta = signal<string[]>([]);
  mobileSidebarOpen = false;
  description = '';
  composerDescription = '';
  popupDescription = '';
  actionsOpen = signal(false);
  StyleTags = ['Modern', 'Cozy', 'Luxury', 'Minimalist', 'Rustic', 'Industrial', 'Scandinavian', 'Bohemian'];
  HouseStyleTags: string[] = [
    'American',
    'British',
    'French',
    'Italian',
    'Japanese',
    'Scandinavian',
    'German',
    'Spanish',
    'Dutch',
    'Australian',
    'Swiss',
    'Moroccan',
    'Turkish',
    'Russian',
  ];

  style: string = '';

  messages = signal<ChatMessage[]>([]);

  conversations = signal<{ id: string; title: string; preview: string }[]>([
    { id: 'c1', title: 'Sample: Bedroom mood board', preview: '2 photos · Think Longer' },
    { id: 'c2', title: 'Real Estate Photo Enhancement', preview: 'Working on image processing...' }
  ]);
  activeConversationId = signal<string>('c1');

  room = computed(() => this.roomModel);

  newChat() {
    const id = crypto.randomUUID();
    this.conversations.update(list => {
      list = [...list];
      list.unshift({ id, title: 'New chat', preview: '' });
      return list;
    });

    this.activeConversationId.set(id);
    this.messages.set([]);
    this.description = '';
    this.pendingImages.set([]);
    this.chosenMeta.set([]);
    this.showPopup = true;
  }
  closePopup() {
    this.showPopup = false;
  }
  toggleMobileSidebar() {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }
  goToProfile() {
    this.router.navigate(['/profile']);
  }
  confirmPopup() {
    if (!this.roomModel && !this.pendingImages().length && !this.popupDescription.trim()) {
      alert("Please upload an image, select a room, or add description.");
      return;
    }
    this.composerDescription = this.popupDescription;
    this.send();
    this.showPopup = false;
    this.popupDescription = '';
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  openConversation(id: string) {
    this.activeConversationId.set(id);
  }
  trackById = (_: number, item: any) => item.id;

  onFiles(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    files.forEach(f => {
      // Keep file for upload
      this.pendingFiles.push(f);

      // Generate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.pendingImages.update(arr => [...arr, String(reader.result)]);
      };
      reader.readAsDataURL(f);
    });

    input.value = '';
  }

  removePendingImage(idx: number) {
    this.pendingImages.update(arr => arr.splice(idx, 1));
  }

  toggleActionsMenu() { this.actionsOpen.update(v => !v); }
  toggleMeta(tag: string) {
    this.chosenMeta.update(arr => {
      return arr.includes(tag) ? arr.filter(x => x !== tag) : [...arr, tag];
    });

  }
  recognizing = signal(false);
  private recognition?: any;

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
        let finalText = this.description || '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) finalText += (finalText ? ' ' : '') + res[0].transcript.trim();
        }
        this.description = finalText;
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
  send() {
    const text = this.composerDescription.trim();
    if (!text && !this.pendingImages().length) return;

    // Show message immediately with previews
    const tempMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      images: this.pendingImages().slice(),
      timestamp: new Date(),
      room: this.roomModel || undefined,
      meta: this.chosenMeta().slice(),
      style: this.style || undefined
    };
    this.messages.update(list => [...list, tempMsg]);

    // Prepare FormData for API
    const formData = new FormData();
    formData.append('title', text);
    formData.append('description', this.composerDescription || '');
    formData.append('propertyType', this.roomModel || '');
    formData.append('enhancementStyle', this.style || 'modern');

    this.pendingFiles.forEach((file, idx) => {
      formData.append('file', file, file.name || `image-${idx}.png`);
    });

    this.isUploading = true;

    this.propertyService.uploadProperty(formData).subscribe({
      next: (res) => {
        this.isUploading = false;

        // Replace base64 previews with real URLs
        this.messages.update(list =>
          list.map(msg =>
            msg.id === tempMsg.id
              ? { ...msg, images: res.generatedImageUrl ? [res.generatedImageUrl] : [] }
              : msg
          )
        );

        // Reset forms, etc.
        this.composerDescription = '';
        this.pendingImages.set([]);
        this.pendingFiles = [];
        this.actionsOpen.set(false);

        const reply: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: this.generateAssistantReply(tempMsg),
          timestamp: new Date()
        };
        this.messages.update(list => [...list, reply]);
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage =
          err?.error?.message || 'Error uploading property. Please try again.';
      }
    });
  }

  private generateAssistantReply(userMsg: ChatMessage): string {
    const lines: string[] = [];
    if (userMsg.images?.length) lines.push(`I see ${userMsg.images.length} image(s).`);
    if (userMsg.room) lines.push(`Room selected: ${userMsg.room}.`);
    if (userMsg.style) lines.push(`style selected: ${userMsg.style}.`);
    if (userMsg.meta?.length) lines.push(`Options: ${userMsg.meta.join(', ')}.`);
    if (userMsg.text) lines.push(`\nAnswering your request:\n${userMsg.text}`);
    lines.push('\n(This is a placeholder response. Wire this up to your backend/LLM.)');
    return lines.join(' ');
  }

}
