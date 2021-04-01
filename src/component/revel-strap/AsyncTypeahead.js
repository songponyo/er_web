import React from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'

export default class RevelAsyncTypeahead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isInvalid: false,
      isValid: false,
      defaultSelected: [],
      useCache: this.props.useCache === undefined ? true : this.props.useCache,
      maxResults: this.props.maxResults || 50,
      keyword: '',
      options: [],
      _cache: [],
    }

    this.asyncTypeaheadRef = React.createRef()
  }

  componentDidMount() {
    this.setState({
      defaultSelected: [{ key: this.props.defaultSelected }],
    })
  }

  componentDidUpdate(props_old) {
    if (props_old.value !== '' && this.props.value === '') {
      if (this.props.showValid) {
        this.setState({
          isInvalid: true,
          isValid: false,
        })
      } else {
        this.asyncTypeaheadRef.current.clear()
      }
    }

    if (this.props.defaultSelected !== undefined) {
      if (props_old.defaultSelected === '' && this.props.defaultSelected !== '') {
        this.setState({
          defaultSelected: [{ key: this.props.defaultSelected }],
        })
      }
    }
  }

  _handleRequestItem(keyword, page = 1) {
    if (this.props.handleRequestItem === undefined) {
      return { options: [], total: 0 }
    } else {
      return this.props.handleRequestItem(keyword, page, this.state.maxResults)
    }
  }

  _handlePagination = (e, shownResults) => {
    const { keyword, _cache, } = this.state

    if (_cache[keyword].options.length > shownResults || _cache[keyword].options.length === _cache[keyword].total) {
      return
    }

    this.setState({
      isLoading: true
    }, async () => {
      const page = _cache[keyword].page + 1

      const resp = await this._handleRequestItem(keyword, page)

      const options = _cache[keyword].options.concat(resp.options)

      this.setState(state => {
        state._cache[keyword] = { ..._cache[keyword], options, page }

        return {
          isLoading: false,
          options: resp.options,
          _cache: state._cache,
        }
      })
    })
  }

  _handleSearch = keyword => {
    const { _cache, useCache, } = this.state

    if (useCache) {
      if (_cache[keyword] !== undefined) {
        this.setState({ options: _cache[keyword].options })
        return
      }
    }

    this.setState({
      isLoading: true
    }, async () => {
      const resp = await this._handleRequestItem(keyword)

      this.setState(state => {
        state._cache[keyword] = { ...resp, page: 1 }

        return {
          isLoading: false,
          options: resp.options,
          _cache: state._cache,
        }
      })
    })
  }

  _renderItem = (item, props, idx) => {
    if (this.props.renderItem === undefined) {
      return (
        <div key={idx}>
          <span>{item.key}</span>
        </div>
      )
    } else {
      return this.props.renderItem(item, props, idx)
    }
  }

  _onChange(e) {
    if (this.props.showValid) {
      this.setState({
        isInvalid: e.length ? false : true,
        isValid: e.length ? true : false,
      })
    } else if (!e.length) {
      this.asyncTypeaheadRef.current.clear()
    }

    this.props.onChange(e)
  }

  render() {
    let { setProps } = this.props

    if (this.props.defaultSelected === undefined) {
      return (
        <AsyncTypeahead
          id="revel_async_typeahead"
          labelKey="key"
          isLoading={this.state.isLoading}
          isInvalid={this.state.isInvalid}
          isValid={this.state.isValid}
          className={this.props.className || ''}
          maxResults={this.state.maxResults - 1}
          minLength={this.props.minLength || 2}
          options={this.state.options}
          onChange={(e) => this._onChange(e)}
          onInputChange={(keyword) => this.setState({ keyword })}
          onPaginate={this._handlePagination}
          onSearch={this._handleSearch}
          paginate
          paginationText={this.props.paginationText || 'แสดงผลลัพธ์เพิ่ม..'}
          placeholder={this.props.placeholder || 'ค้นหา..'}
          renderMenuItemChildren={this._renderItem}
          ref={this.asyncTypeaheadRef}
          useCache={this.state.useCache}
          {...setProps}
        />
      )
    } else {
      return this.state.defaultSelected.length ?
        <AsyncTypeahead
          id="revel_async_typeahead"
          labelKey="key"
          defaultSelected={this.state.defaultSelected}
          isLoading={this.state.isLoading}
          isInvalid={this.state.isInvalid}
          isValid={this.state.isValid}
          maxResults={this.state.maxResults - 1}
          minLength={this.props.minLength || 2}
          options={this.state.options}
          onChange={(e) => this._onChange(e)}
          onInputChange={(keyword) => this.setState({ keyword })}
          onPaginate={this._handlePagination}
          onSearch={this._handleSearch}
          paginate
          paginationText={this.props.paginationText || 'แสดงผลลัพธ์เพิ่ม..'}
          placeholder={this.props.placeholder || 'ค้นหา..'}
          renderMenuItemChildren={this._renderItem}
          ref={this.asyncTypeaheadRef}
          useCache={this.state.useCache}
          {...setProps}
        />
        :
        <input autoComplete="off" placeholder={this.props.placeholder || 'ค้นหา..'} type="text" className="form-control" />
    }
  }
}