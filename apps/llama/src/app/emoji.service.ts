import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {
  cache: { key, value }[] = [];
  constructor(private http: HttpClient) { }
  async getEmojiForText(text: string): Promise<string> {
    const cacheKeyValue = this.cache.filter(keyValue => (keyValue.key === text));
    if (cacheKeyValue[0] !== undefined) {
      return cacheKeyValue[0].value;
    }
    const emojiArray: any = await this.http.get('https://emoji.th105.de/', { params: { "lang": "de", "max": "1", "minRelevance": "0.8", "search": text } }).toPromise();
    if (emojiArray !== undefined && emojiArray.length > 0) {
      cacheKeyValue.push({ key: text, value: emojiArray[0].char })
      return emojiArray[0].char;
    }
    return '';
  }
}
