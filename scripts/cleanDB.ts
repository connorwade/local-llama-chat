import { rm } from 'node:fs';
import { resolve } from 'node:path';

rm(resolve(import.meta.dirname, '../drizzle-dev'), { recursive: true }, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log('db has been deleted');
	}
});
