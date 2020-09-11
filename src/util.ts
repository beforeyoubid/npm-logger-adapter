/**
 * Handy function to check if we are sending to LogDNA
 * @param logDNAKey
 * @param sendToRemote
 */
export const isLogDNAEnabled = (logDNAKey: string, sendToRemote: boolean): boolean => !!logDNAKey && sendToRemote;
