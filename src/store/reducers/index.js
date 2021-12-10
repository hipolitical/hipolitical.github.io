import { combineReducers } from 'redux';
import theme from './themeStore';
import accounts from './accounts';
import all_accounts from './all_accounts';
import requests from './requests';
import placements from './placements';

export default combineReducers({
  theme,
  accounts,
  all_accounts,
  requests,
  placements,
});