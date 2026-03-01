/* eslint-disable no-restricted-imports */

import pkg from '../../package.json' with { type: 'json' };
export const { description, name, version } = pkg ?? {};
