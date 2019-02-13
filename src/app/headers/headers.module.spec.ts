import { HeadersModule } from './headers.module';

describe('HeadersModule', () => {
  let headersModule: HeadersModule;

  beforeEach(() => {
    headersModule = new HeadersModule();
  });

  it('should create an instance', () => {
    expect(headersModule).toBeTruthy();
  });
});
