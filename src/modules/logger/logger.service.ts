import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logLevel: number;
  private readonly maxFileSize: number;
  private readonly logFilePath: string;
  private readonly errorLogFilePath: string;

  constructor(context?: string) {
    super(context);
    this.logLevel = parseInt(process.env.LOG_LEVEL || '2');
    this.maxFileSize = parseInt(process.env.LOG_MAX_FILE_SIZE || '1024');
    this.logFilePath = process.env.LOG_FILE_PATH || 'logs/app.log';
    this.errorLogFilePath = process.env.ERROR_LOG_FILE_PATH || 'logs/error.log';
    this.initializeLogFiles();
  }

  private initializeLogFiles() {
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private writeLog(filePath: string, message: string) {
    const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : { size: 0 };
    if (stats.size >= this.maxFileSize * 1024) {
      const rotatedPath = `${filePath}.${Date.now()}`;
      fs.renameSync(filePath, rotatedPath);
    }
    fs.appendFileSync(filePath, `${message}\n`);
  }

  private shouldLog(level: number): boolean {
    return level >= this.logLevel;
  }

  private logToFile(level: string, message: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    this.writeLog(this.logFilePath, formattedMessage);

    if (level === 'ERROR') {
      this.writeLog(this.errorLogFilePath, formattedMessage);
    }
  }

  debug(message: string, context?: string) {
    if (this.shouldLog(0)) {
      super.debug(message, context);
      this.logToFile('DEBUG', message);
    }
  }

  log(message: string, context?: string) {
    if (this.shouldLog(1)) {
      super.log(message, context);
      this.logToFile('INFO', message);
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog(2)) {
      super.warn(message, context);
      this.logToFile('WARN', message);
    }
  }

  error(message: string, stack?: string, context?: string) {
    if (this.shouldLog(3)) {
      super.error(message, stack, context);
      this.logToFile('ERROR', `${message}${stack ? `\n${stack}` : ''}`);
    }
  }
}
