import Config from '../../config';
import {
  getDecryptedPassphrase,
  getPinList,
  triggerToaster,
  shepherdElectrumAuth,
} from '../actionCreators';
import translate from '../../translate/translate';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';
import Store from '../../store';

export const encryptPassphrase = (string, key, suppressToastr) => {
  const payload = {
    string,
    key,
    token: Config.token,
  };

  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/encryptkey`,
      fetchType(JSON.stringify(payload)).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'encryptKey',
          'Error',
          'error'
        )
      );
      resolve({ msg: 'error' });
    })
    .then(response => response.json())
    .then(json => {
      if (!suppressToastr) {
        Store.dispatch(
          triggerToaster(
            translate('INDEX.PASSPHRASE_SUCCESSFULLY_ENCRYPTED'),
            translate('KMD_NATIVE.SUCCESS'),
            'success'
          )
        );
      }
      resolve(json);
    });
  });
}

export const loginWithPin = (key, pubkey) => {
  const payload = {
    key,
    pubkey,
    token: Config.token,
  };

  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/decryptkey`,
      fetchType(JSON.stringify(payload)).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'decryptKey',
          'Error',
          'error'
        )
      );
      resolve({ msg: 'error' });
    })
    .then(response => response.json())
    .then(json => {
      if (json.msg === 'success') {
        // Store.dispatch(shepherdElectrumAuth(json.result));
        resolve(json);
      } else {
        Store.dispatch(
          triggerToaster(
            json.result,
            'Pin decrypt error',
            'error'
          )
        );
        resolve(json);
      }
    });
  });
}

export const loadPinList = () => {
  return dispatch => {
    const _urlParams = {
      token: Config.token,
    };
    return fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/getpinlist${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'getPinList',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      /*dispatch(
        triggerToaster(
          'getPinList',
          'Success',
          'success'
        )
      );*/
      dispatch(
        getPinList(json.result)
      );
    });
  }
}