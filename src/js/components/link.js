import Component from './component';
import Prompt from '../prompt';
import Selection from '../selection';

export default class Link extends Component {
  constructor (link) {
    super();

    this._init(link);
  }

  static add () {
    return new Promise((resolve, reject) => {
      const link = new Link();
      link.edit();
      // to stop align from adding element to DOM
      resolve({});
    });
  }

  _init (link) {
    this.el = link || document.createElement('a');
    this.el.target = '_blank';
    if (!link) {
      this.el.appendChild(Selection.range.extractContents());
      Selection.range.insertNode(this.el);
    }
    this.el.addEventListener('click', this.edit.bind(this));
  }

  edit () {
    const prompt = new Prompt(this.$align, {
      message: 'Enter link:',
      data: this.el.getAttribute('href')
    });
    prompt.on('save', () => {
      const link = prompt.inputs[0].value;
      if (!link) return;
      this.update(link);
    });
    if (this.el.href) {
      prompt.on('remove', () => {
        this.remove();
      });
    }
  }

  update (link) {
    this.el.href = link;
  };

  remove () {
    const content = this.el.innerHTML;
    this.el.insertAdjacentHTML('beforebegin', content);
    super.remove();
  }

  static schema = {
    tooltip: 'Hyperlink',
    icon: 'link'
  }
}
