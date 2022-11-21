//import { TLPeriod } from './TLPeriod';
import { stringUtils } from './lib/stringutils';
import { TLPeriod } from './lib/TLPeriod';

export class ApiClient {
  private static instance: ApiClient;
  private constructor() {
    // do something construct...
  }
  public static getInstance() {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
      // ... any one time initialization goes here ...
    }
    return ApiClient.instance;
  }

  private HttpError(response: Response) {
    return 'Ошибка HTTP - ' + response.status;
  }

  public async DoLogin(login: string, password: string): Promise<{ jwtToken: string, user: string }> {
    if ((login || '').trim() !== '' && (password || '').trim() !== '') {
      const passwordMd5 = stringUtils.md5(password);
      const response = await fetch('auth/logon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Login: login, Password: passwordMd5 }),
      });
      if (response.headers.has('tl-server')) {
        if (response.ok) {
          const authInfo = await response.json();
          return { jwtToken: authInfo.access_token, user: login };
        } else {
          throw new Error(response.statusText);
        }
      } else {
        return { jwtToken: '11111111111111111111111111111111', user: login };
      }
    } else {
      throw new Error('Не введены логин или пароль.');
    }
  }

  public async SaveTL(model: TLPeriod): Promise<string> {
    const response = await fetch('save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('tokenTL'),
      },
      body: JSON.stringify({ s1: model.Name, s2: JSON.stringify(model) }),
    });
    console.log(response);
    if (response.ok) return '';
    else return 'Ошибка: ' + (await response.text());
  }

  public async TestToken(): Promise<string> {
    const response = await fetch('test', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('tokenTL'),
        'Cache-Control': 'no-cache',
      },
    });
    if (response.headers.has('tl-server')) {
      if (response.ok) {
        try {
          const respObject = await response.json();
          return await respObject.s2;
        }
        catch (err) {
          throw new Error("Недопустимый ответ сервера.")
        }
      } else {
        throw new Error(response.statusText);
      }
    } else {
      const user = localStorage.getItem('userTL');
      if (user) return user;
      else return '';
    }
  }

  public async DoLogout(): Promise<boolean> {
    localStorage.removeItem('tokenTL');
    return true;
  }

  public async GetUsersList(): Promise<string[]> {
    const response = await fetch('list', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('tokenTL'),
        'Cache-Control': 'no-cache',
      },
    });
    if (response.headers.has('tl-server')) {
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Статус - ' + response.status + ' ' + response.statusText);
      }
    } else {
      return ['Один', 'Два', 'Три'];
    }
  }

  public async GetTL(value: string): Promise<TLPeriod> {
    const response = await fetch('load?' + new URLSearchParams({ tlname: value }), {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('tokenTL'),
      },
    });
    if (response.ok) {
      const tline = await response.json();
      const period = TLPeriod.CreateTLPeriod(tline);
      period.Parent = null;
      return period;
    } else {
      throw new Error('Ошибка загрузки данных');
    }
  }

  public async DoRegister(
    login: string,
    email: string,
    password1: string,
    password2: string,
  ): Promise<string> {
    if (password1 !== password2) {
      return 'Не совпадают пароли';
    }
    const passwordMd5 = stringUtils.md5(password1);
    const response = await fetch('auth/newuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Login: login,
        Email: email,
        Password1: passwordMd5,
        Password2: passwordMd5,
      }),
    });
    if (response.ok) {
      return '';
    } else {
      return (await response.json()).message;
    }
  }
}
