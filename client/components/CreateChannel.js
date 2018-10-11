import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {TextField, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {
  setSinglePodcast,
  setPodcastList,
  fetchCategoryPodcastsEpisodeData
} from '../reducers/podcast';
import {connect} from 'react-redux';

let suggestions = [];

async function fetchAPIGenres() {
  let res = await axios.get('/api/genre/apilist');
  let APIgenresList = res.data.genres;
  suggestions = APIgenresList.map(genre => ({
    label: genre.name,
    id: genre.id
  }));
}

const styles = theme => ({
  root: {
    height: 250,
    flexGrow: 1
  },
  container: {
    position: 'relative'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  divider: {
    height: theme.spacing.unit * 2
  },
  input: {
    marginTop: '1rem'
  }
});

function renderInputComponent(inputProps) {
  const {classes, inputRef = () => {}, ref, ...other} = inputProps;

  return (
    <div>
      <Typography variant="display1">Create a channel</Typography>
      <Typography variant="subheading">
        Start typing below to select from our list of genres.
      </Typography>
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input
          }
        }}
        {...other}
      />
    </div>
  );
}

function renderSuggestion(suggestion, {query, isHighlighted}) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{fontWeight: 500}}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{fontWeight: 300}}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

class IntegrationAutosuggest extends React.Component {
  state = {
    single: '',
    suggestions: [],
    id: 0,
    reDirect: false
  };

  handleSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = name => (event, {newValue}) => {
    this.setState({
      [name]: newValue
    });
  };

  componentDidMount() {
    fetchAPIGenres();
  }

  createAndRenderChannel = () => async event => {
    event.preventDefault();
    try {
      let searchInput = this.state.single;
      let matchingId = suggestions.filter(sugg => sugg.label === searchInput);
      let genreId = matchingId[0].id;
      let res = await axios.get(`/api/podcast?id=${genreId}`);
      let channelList = res.data;

      if (channelList.channels === undefined) {
        throw new Error('channelList is undefined');
      }

      this.props.fetchCategoryPodcastsEpisodeData(channelList.channels);

      // let randomPodcast =
      //   channelList.channels[Math.floor(Math.random() * channelList.channels.length + 1)];
      // if (randomPodcast === undefined) throw new Error('randomPodcast is undefined')
      // this.props.setSinglePodcast(randomPodcast);
      // this.props.setPodcastList(channelList.channels);

      const createdChannel = await axios.post('/api/channel', {
        name: searchInput
      });
      this.setState({
        id: createdChannel.data.id,
        reDirect: true
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {classes} = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
    };

    if (this.state.reDirect) {
      return <Redirect to={`/channel/${this.state.id}`} />;
    }

    return (
      <div className={classes.root}>
        <form onSubmit={this.createAndRenderChannel()}>
          <Autosuggest
            {...autosuggestProps}
            inputProps={{
              classes,
              placeholder: 'Search',
              value: this.state.single,
              onChange: this.handleChange('single')
            }}
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion
            }}
            renderSuggestionsContainer={options => (
              <Paper {...options.containerProps} square>
                {options.children}
              </Paper>
            )}
          />
          <div className={classes.divider} />
          <Button type="submit" color="secondary">
            Create Channel
          </Button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // setSinglePodcast: podcast => dispatch(setSinglePodcast(podcast)),
    // setPodcastList: podcasts => dispatch(setPodcastList(podcasts)),
    fetchCategoryPodcastsEpisodeData: podcasts =>
      dispatch(fetchCategoryPodcastsEpisodeData(podcasts))
  };
};

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(IntegrationAutosuggest)
);
