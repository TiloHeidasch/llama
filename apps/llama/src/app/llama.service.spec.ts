import { TestBed } from '@angular/core/testing';

import { LlamaService } from './llama.service';

describe('LlamaService', () => {
  let service: LlamaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlamaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
