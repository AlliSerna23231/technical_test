export class MethodAdapter {
  static getCurrentUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000); 
  }
}
