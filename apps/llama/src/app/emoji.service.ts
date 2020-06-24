import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {
  private cache: { key, value }[] = [];
  constructor(private http: HttpClient) { }
  async getEmojiForText(text: string): Promise<string> {
    let emoji: string = '';
    let isFirst: boolean = true;
    const textBlocks: string[] = text.split(' ');
    for (let index = 0; index < textBlocks.length; index++) {
      const textBlock = textBlocks[index];

      const cacheKeyValue = this.cache.filter(keyValue => (keyValue.key === text));
      if (cacheKeyValue[0] !== undefined) {
        if (!isFirst) {
          emoji += ' ';
        }
        emoji += cacheKeyValue[0].value;
        isFirst = false;
      } else {
        const emojiArray: any = await this.http.get('https://emoji.th105.de/', { params: { "lang": "de", "max": "1", "minRelevance": "0.5", "search": textBlock } }).toPromise();
        if (emojiArray !== undefined && emojiArray.length > 0) {
          cacheKeyValue.push({ key: text, value: emojiArray[0].char });
          if (!isFirst) {
            emoji += ' ';
          }
          emoji += emojiArray[0].char;
          isFirst = false;
        }
      }
    }
    return emoji;
  }
}
