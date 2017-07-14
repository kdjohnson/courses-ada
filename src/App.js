import React, { Component } from "react"
import "./App.css"
import CoursesTabs from "./components/CoursesTabs"
import AdvisingTabs from "./components/AdvisingTabs"
import TermsMenu from "./components/TermsMenu"
import { getTerms, getCourses } from "./api/api"

class App extends Component {
  state = {
    terms: null,
    currentTermDescription: "",
    currentTermCode: "",
    courses: null,
    width: document.getElementById("root").clientWidth,
    mobile: false,
    advising: true
  }

  updateWidth = () => {
    this.setState({
      width: document.getElementById("root").clientWidth
    })
    if (this.state.width < 796) {
      this.setState({ mobile: true })
    } else {
      this.setState({ mobile: false })
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth)
    if (document.getElementById("root").clientWidth < 796) {
      this.setState({ mobile: true })
    }

    getTerms()
      .then(terms => {
        for (let i = 0, total = terms.length; i < total; i++) {
          if (Object.is(terms[i].current, "true")) {
            this.setState({
              currentTermDescription: terms[i].description,
              currentTermCode: terms[i].code
            })
          }
        }
        this.setState({ terms })
      })
      .then(() => {
        getCourses(this.state.currentTermCode).then(courses => {
          this.setState({ courses })
        })
      })
  }

  updateTerm = currentTermCode => {
    getCourses(currentTermCode).then(courses => {
      this.setState({ courses })
    })
  }

  getView = () => {
    if (Object.is(this.state.terms, null)) {
      return <div />
    } else if (!Object.is(this.state.courses, null) && !this.state.advising) {
      return (
        <div>
          <TermsMenu
            terms={this.state.terms}
            currentTermDescription={this.state.currentTermDescription}
            updateTerm={this.updateTerm}
            mobile={this.state.mobile}
          />
          <CoursesTabs
            currentTermCode={this.state.currentTermCode}
            courses={this.state.courses}
            mobile={this.state.mobile}
            advising={this.state.advising}
          />
        </div>
      )
    } else {
      if (!this.state.advising) {
        return (
          <div>
            <TermsMenu
              terms={this.state.terms}
              currentTermDescription={this.state.currentTermDescription}
              updateTerm={this.updateTerm}
              mobile={this.state.mobile}
            />
            <CoursesTabs
              currentTermCode={this.state.currentTermCode}
              courses={this.state.courses}
              mobile={this.state.mobile}
              advising={this.state.advising}
            />
          </div>
        )
      } else {
        return (
          <div>
            <TermsMenu
              terms={this.state.terms}
              currentTermDescription={this.state.currentTermDescription}
              updateTerm={this.updateTerm}
              mobile={this.state.mobile}
            />
            <AdvisingTabs
              currentTermCode={this.state.currentTermCode}
              courses={this.state.courses}
              mobile={this.state.mobile}
            />
          </div>
        )
      }
    }
  }

  render() {
    return (
      <div>
        {this.getView()}
      </div>
    )
  }
}

export default App
