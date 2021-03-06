import React, { Component } from 'react'
import axios from 'axios'
import NewAdd from './NewAdd'
import NewList from './NewList'

const URL = 'http://localhost:3333/api/easyAddList'

export default class EasyAdd extends Component {
    constructor(props) {
        super(props)
        this.state = { description: '', list: [] }

        this.handleChange = this.handleChange.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClear = this.handleClear.bind(this)

        this.handleRemove = this.handleRemove.bind(this)
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)

        this.refresh()
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : ''
        axios.get(`${URL}?sort=-createAt${search}`)
            .then(resp => this.setState({ ...this.state, description, list: resp.data }))
    }

    handleChange(e) {
        this.setState({ ...this.state, description: e.target.value })
    }

    handleAdd() {
        const description = this.state.description
        axios.post(URL, { description })
            .then(resp => this.refresh())
    }

    handleSearch() {
        this.refresh(this.state.description)
    }

    handleClear() {
        this.refresh()
    }

    handleMarkAsDone(addlist) {
        axios.put(`${URL}/${addlist._id}`, { ...addlist, done: true })
            .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsPending(addlist) {
        axios.put(`${URL}/${addlist._id}`, { ...addlist, done: false })
            .then(resp => this.refresh(this.state.description))
    }

    handleRemove(addlist) {
        axios.delete(`${URL}/${addlist._id}`)
            .then(resp => this.refresh(this.state.description))
    }

    render() {
        return (
            <div className='home'>
                <NewAdd
                    description={this.state.description}
                    handleChange={this.handleChange}
                    handleAdd={this.handleAdd}
                    handleSearch={this.handleSearch}
                    handleClear={this.handleClear}
                />

                <NewList
                    list={this.state.list}
                    handleMarkAsDone={this.handleMarkAsDone}
                    handleMarkAsPending={this.handleMarkAsPending}
                    handleRemove={this.handleRemove}
                />
            </div>
        )
    }
}
