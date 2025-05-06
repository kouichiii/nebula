import { common, createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';

const lowlight = createLowlight(common);
lowlight.register('js', javascript);
lowlight.register('ts', typescript);

export default lowlight;