import debug from 'debug';
import { env } from './config/env.ts';

const log = debug(`${env.PROJECT_NAME}:index`);
log('Starting application');
