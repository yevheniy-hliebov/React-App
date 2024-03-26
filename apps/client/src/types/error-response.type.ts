export type ErrorResponse = {
  success: boolean;
  message: string;
  method: string; 
  path: string;
  statusCode: number;
  timestamp: Date | string
}