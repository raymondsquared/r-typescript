interface SecurityClientInterface<T> {
  mask(data: T[], columnNames: string[]): Promise<T[]>;
}

export { SecurityClientInterface };
