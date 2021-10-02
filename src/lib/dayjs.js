import dayjs from 'dayjs';
import utcPlugin from 'dayjs-plugin-utc';

import 'dayjs/locale/es'

dayjs
  .extend(utcPlugin)
  .locale('es');

export default dayjs;