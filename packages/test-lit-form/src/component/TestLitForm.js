import { html } from 'sling-framework';
import { omit } from 'sling-helpers';
import { withForm } from 'sling-web-component-form';
import 'sling-web-component-field';

import {
  validateUsernameAvailability,
  validatePresenceOfAnyTel,
} from './customValidations.js';

export const TestLitForm = Base => class extends withForm(Base) {
  constructor() {
    super();

    this.setValues({
      name: '',
      lastname: '',
      username: '',
      email: '',
      cpf: '',
      cnpj: '',
      phones: {
        cell: '',
        land: '',
      },
      games: [],
    });

    this.addGame = this.addGame.bind(this);
  }

  static get properties() {
    return {
      formState: {
        type: Object,
        reflectToAttribute: false,
      },
    };
  }

  addGame() {
    this.setValues({
      ...this.state.values,
      games: [
        ...this.state.values.games || [],
        '',
      ],
    });
  }

  removeGame(index) {
    return () => {
      this.setValues({
        ...this.state.values,
        games: this.state.values.games.filter((_, idx) => idx !== index),
      });
    };
  }

  render() {
    const { values } = this.formState;

    return html`
      <style>
        @import url('test-lit-form/src/index.css');
      </style>
      
      <sling-form
        class="form"
        validation="${validatePresenceOfAnyTel}">

        <div class="form__title">
          <h3>Dados</h3>
        </div>

        <div>
          <h4>Nome</h4>
          <sling-field
            name="name"
            required></sling-field>
        </div>

        <div>
          <h4>Sobrenome</h4>
          <sling-field
            name="lastname"
            required></sling-field>
        </div>

        <div>
          <h4>Apelido</h4>
          <sling-field
            name="username"
            validation="${validateUsernameAvailability}"
            validationhook="input"
            required></sling-field>
        </div>

        <div>
          <h4>E-mail</h4>
          <sling-field
            name="email"
            type="email"
            required></sling-field>
        </div>

        <div>
          <h4>CPF</h4>
          <sling-field
            name="cpf"
            type="cpf"
            required></sling-field>
        </div>

        <div>
          <h4>CNPJ</h4>
          <sling-field
            name="cnpj"
            type="cnpj"
            required></sling-field>
        </div>

        <div class="form__title">
          <h3>Telefones</h3>
        </div>

        <div>
          <h4>Celular</h4>
          <sling-field
            name="phones.cell"
            type="tel"></sling-field>
        </div>

        <div>
          <h4>Fixo</h4>
          <sling-field
            name="phones.land"
            type="tel"></sling-field>
        </div>

        <div class="form__title">
          <h3>
            Jogos preferidos
            <button
              type="button"
              onclick="${this.addGame}">
              Adicionar</button>
          </h3>
        </div>

        ${values.games && values.games.map((_, index) => html`
          <div>
            <h4>
              Nome
              <button
                type="button"
                onclick="${this.removeGame(index)}"
                tabindex="-1">
                Remover</button>
            </h4>
            <sling-field
              name="games[${index}]"
              required></sling-field>
          </div>
        `)}
      </sling-form>

      <!-- pre>${JSON.stringify(omit(this.formState, 'byId'), null, 2)}</pre -->
    `;
  }
};
