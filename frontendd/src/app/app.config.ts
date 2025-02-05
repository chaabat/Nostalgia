import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { APP_ROUTES } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { albumReducer } from './store/album/album.reducer';
import { AlbumEffects } from './store/album/album.effects';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { songReducer } from './store/song/song.reducer';
import { playerReducer } from './store/player/player.reducer';
import { SongEffects } from './store/song/song.effects';
import { PlayerEffects } from './store/player/player.effects';
import { AudioService } from './core/services/audio.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimationsAsync(),
    provideStore({ 
      auth: authReducer,
      albums: albumReducer,
      songs: songReducer,
      player: playerReducer
    }),
    provideEffects([
      AuthEffects,
      AlbumEffects,
      SongEffects,
      PlayerEffects
    ]),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
    ),
    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService,
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    AudioService,
  ]
};
