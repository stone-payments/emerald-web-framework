import { cancelableDelay } from 'sling-web-component-form';

export const validateUsernameAvailability = (value) => {
  if (!value) {
    return 'Required';
  }

  if (value.length < 3) {
    return 'Type at least 3 characters';
  }

  return cancelableDelay(3000)
    .then(() => fetch(`https://api.github.com/users/${value}`))
    .then(response => (response.ok ? 'User exists' : undefined))
    .catch(() => undefined);
};

export const validatePresenceOfAnyTel = (values) => {
  if (!values.phones || (!values.phones.cell && !values.phones.land)) {
    return { hasPhone: 'Fill in at least one phone number' };
  }

  return {};
};