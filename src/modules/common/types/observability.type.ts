interface ObservabilityClientInterface {
  create(key: string, value: number): Promise<void>;
  increase(key: string, value: number): Promise<void>;
  decrease(key: string, value: number): Promise<void>;
}

export { ObservabilityClientInterface };
