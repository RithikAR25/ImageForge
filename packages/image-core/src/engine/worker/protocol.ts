import type { ProcessingOperation } from '@imageforge/types';

export type WorkerMessageType =
  | 'INITIALIZE'
  | 'PROCESS'
  | 'PROGRESS'
  | 'SUCCESS'
  | 'ERROR'
  | 'CANCEL'
  | 'DISPOSE';

export interface WorkerInitializeMessage {
  type: 'INITIALIZE';
  payload: { wasmBaseUrl: string };
}

export interface WorkerProcessMessage {
  type: 'PROCESS';
  jobId: string;
  payload: {
    buffer: ArrayBuffer;
    operation: ProcessingOperation;
  };
}

export interface WorkerCancelMessage {
  type: 'CANCEL';
  jobId: string;
}

export interface WorkerDisposeMessage {
  type: 'DISPOSE';
}

export type WorkerMessage =
  | WorkerInitializeMessage
  | WorkerProcessMessage
  | WorkerCancelMessage
  | WorkerDisposeMessage;

export interface WorkerProgressEvent {
  type: 'PROGRESS';
  jobId: string;
  payload: { progress: number };
}

export interface WorkerSuccessEvent {
  type: 'SUCCESS';
  jobId: string;
  payload: { buffer: ArrayBuffer };
}

export interface WorkerErrorEvent {
  type: 'ERROR';
  jobId: string;
  payload: { message: string; code?: string };
}

export type WorkerEvent = WorkerProgressEvent | WorkerSuccessEvent | WorkerErrorEvent;
