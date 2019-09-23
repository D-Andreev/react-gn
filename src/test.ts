import Cra from './services/Cra';
import * as childProcess from 'child_process';
import {CRA_EVENT} from './constants';

const cra = new Cra(childProcess);
cra.createApp('the-name', './');
cra.on(CRA_EVENT.INIT_ERROR, (err) => {
    console.log('err', err);
});
cra.on(CRA_EVENT.INIT_DATA, (data) => {
    console.log('data', data);
});
cra.on(CRA_EVENT.INIT_CLOSE, (code) => {
    console.log('code', code);
});

