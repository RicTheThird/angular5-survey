
import { AuthenticationService } from './authentication.service';
import { ExceptionHandlerService } from './exception-handler.service';
import { GeoLocationService } from './geolocation.service';
import { StorageService } from './storage.service';
import { SurveyService } from './survey.service';

export const ServicesModule = [
    AuthenticationService, ExceptionHandlerService, GeoLocationService,
    StorageService, SurveyService
]