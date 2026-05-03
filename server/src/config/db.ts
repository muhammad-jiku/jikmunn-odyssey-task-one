import mongoose from "mongoose";

export async function connectToDatabase(uri: string): Promise<void> {
  await mongoose.connect(uri);
}

export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export function getDbState(): { readyState: number; connected: boolean } {
  const readyState = mongoose.connection.readyState;
  return {
    readyState,
    connected: readyState === 1
  };
}
