/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NbAuthTokenClass, NbAuthJWTToken } from '../../services/token/token';
import { NbAuthStrategyOptions } from '../auth-strategy-options';
import { getDeepFromObject } from '../../helpers';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export interface SmqStrategyModule {
  alwaysFail?: boolean;
  endpoint?: string;
  method?: string;
  redirect?: {
    success?: string | null;
    failure?: string | null;
  };
  requireValidToken?: boolean;
  defaultErrors?: string[];
  defaultMessages?: string[];
}

export interface SmqStrategyReset extends SmqStrategyModule {
  resetPasswordTokenKey?: string;
}

export interface SmqStrategyToken {
  class?: NbAuthTokenClass,
  key?: string,
  getter?: Function,
}

export interface SmqStrategyMessage {
  key?: string,
  getter?: Function,
}

export class SmqAuthStrategyOptions extends NbAuthStrategyOptions {
  baseEndpoint? = '/api/auth/';
  login?: boolean | SmqStrategyModule = {
    alwaysFail: false,
    endpoint: 'login',
    method: 'post',
    requireValidToken: false,
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Login/Email combination is not correct, please try again.'],
    defaultMessages: ['You have been successfully logged in.'],
  };
  register?: boolean | SmqStrategyModule = {
    alwaysFail: false,
    endpoint: 'register',
    method: 'post',
    requireValidToken: false,
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully registered.'],
  };
  requestPass?: boolean | SmqStrategyModule = {
    endpoint: 'request-pass',
    method: 'post',
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Reset password instructions have been sent to your email.'],
  };
  resetPass?: boolean | SmqStrategyReset = {
    endpoint: 'reset-pass',
    method: 'put',
    redirect: {
      success: '/',
      failure: null,
    },
    resetPasswordTokenKey: 'reset_password_token',
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your password has been successfully changed.'],
  };
  logout?: boolean | SmqStrategyReset = {
    alwaysFail: false,
    endpoint: 'logout',
    method: 'delete',
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully logged out.'],
  };
  refreshToken?: boolean | SmqStrategyModule = {
    endpoint: 'refresh-token',
    method: 'post',
    requireValidToken: false,
    redirect: {
      success: null,
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your token has been successfully refreshed.'],
  };
  token?: SmqStrategyToken = {
    class: NbAuthJWTToken,
    key: 'data.token',
    getter: (module: string, res: HttpResponse<Object>, options: SmqAuthStrategyOptions) => getDeepFromObject(
      res['AccessToken'],
      options.token.key,
    ),
  };
  errors?: SmqStrategyMessage = {
    key: 'data.errors',
    getter: (module: string, res: HttpErrorResponse, options: SmqAuthStrategyOptions) => getDeepFromObject(
      res.error,
      options.errors.key,
      options[module].defaultErrors,
    ),
  };
  messages?: SmqStrategyMessage = {
    key: 'data.messages',
    getter: (module: string, res: HttpResponse<Object>, options: SmqAuthStrategyOptions) => getDeepFromObject(
      res.body,
      options.messages.key,
      options[module].defaultMessages,
    ),
  };
  validation?: {
    password?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
    email?: {
      required?: boolean;
      regexp?: string | null;
    };
    fullName?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
  };
}

export const smqStrategyOptions: SmqAuthStrategyOptions = new SmqAuthStrategyOptions();
