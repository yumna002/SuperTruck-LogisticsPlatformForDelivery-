import * as path from 'path';
import { AcceptLanguageResolver, I18nJsonLoader, I18nOptions  } from 'nestjs-i18n';
import { QueryResolver, HeaderResolver } from 'nestjs-i18n';



export const i18nConfig: I18nOptions  = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname), 
    watch: true,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
    new HeaderResolver(['x-lang']),
  ],
  loader: I18nJsonLoader,
};
