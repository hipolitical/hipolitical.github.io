import {
  GET_MY_ACCOUNTS_REQUESTED,
  ADD_CLIENT_ACCOUNT_REQUESTED,
  UPDATE_CLIENT_ACCOUNT_REQUESTED,
} from "../types";

export function getMyAccounts() {
  return { type: GET_MY_ACCOUNTS_REQUESTED };
}

export function addClientAccount(account) {
  return { type: ADD_CLIENT_ACCOUNT_REQUESTED, account };
}

export function updateClientAccount(account) {
  return { type: UPDATE_CLIENT_ACCOUNT_REQUESTED, account };
}