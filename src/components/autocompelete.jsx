// @flow
import Autosuggest from 'react-autosuggest';
import { Component } from 'react';
import { useTranslation } from 'react-i18next';
import { NS_COMMON } from 'App/share/i18next';

type Props = {
  defaultSearchValue: object,
  searchFunc: () => void,
  suggestionOpption: array,
  value: object,
};

class Autocompelete extends Component<Props> {
  state = {
    value: '',
    suggestions: [],
  };

  componentDidMount() {
    const { defaultSearchValue } = this.props;
    this.setState({ value: defaultSearchValue });
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onChange = (event, { newValue }) => {
    const { searchFunc } = this.props;
    searchFunc(newValue, false);
    this.setState({
      value: newValue,
    });
  };

  onKeyDown = (e) => {
    const { searchFunc } = this.props;
    if (e.keyCode === 13) {
      e.preventDefault();
      // Enter
      searchFunc(e.target.value, true);
      this.setState({
        value: e.target.value,
      });
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // eslint-disable-next-line react/sort-comp
  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  getSuggestions(value) {
    const { suggestionOpption } = this.props;

    if (value.length < 2) {
      return [];
    }
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    return suggestionOpption.filter((language) => {
      return language.value && typeof language.value === 'string'
        ? language.value.toLowerCase().includes(value.toLowerCase())
        : false;
    });
  }

  getSuggestionValue = (suggestion) => {
    return suggestion.value;
  };

  renderSuggestion = (suggestion) => {
    return <span>{suggestion.value}</span>;
  };

  AutoSuggestionContainer = (props) => {
    const {
      value,
      data,
      onChange,
      onKeyDown,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    } = props;
    const { t } = useTranslation(NS_COMMON);
    const inputProps = {
      className: 'w-100 form-control',
      placeholder: `${t('Search...')}`,
      value,
      onChange,
      onKeyDown: onKeyDown.bind(this),
    };

    return (
      <Autosuggest
        suggestions={data}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  };

  render() {
    const { value, suggestions } = this.state;
    const { value: valueProps } = this.props;
    return (
      <this.AutoSuggestionContainer
        value={value || valueProps || ''}
        data={suggestions}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
      />
    );
  }
}

export default Autocompelete;
