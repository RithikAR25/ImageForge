export interface DesignTokens {
  readonly color: Record<string, Record<string, string>>;
  readonly typography: Record<
    string,
    {
      fontFamily: string;
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing?: number;
    }
  >;
  readonly spacing: Record<string, number>;
  readonly rounded: Record<string, number>;
  readonly motion: Record<
    string,
    {
      duration: number;
      easing: [number, number, number, number];
    }
  >;
}

export interface Theme {
  readonly name: string;
  readonly mode: 'light' | 'dark';
  readonly color: {
    readonly primary: Record<string, string>;
    readonly secondary: Record<string, string>;
    readonly tertiary: Record<string, string>;
    readonly error: Record<string, string>;
    readonly background: Record<string, string>;
    readonly surface: Record<string, string>;
    readonly text: Record<string, string>;
    readonly outline: Record<string, string>;
  };
  readonly typography: DesignTokens['typography'];
  readonly spacing: DesignTokens['spacing'];
  readonly rounded: DesignTokens['rounded'];
  readonly motion: DesignTokens['motion'];
}
