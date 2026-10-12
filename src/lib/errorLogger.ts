export function logError(err: unknown) {

  if (err instanceof Error) {
    console.error(`❌ [Runtime Error] ${err.name}: ${err.message}`);
    console.error(`Stack Trace:\n${err.stack}`);
    return;
  }

  console.error(`❌ [Unknown Thrown Type: ${typeof err}]`, err);
}
