import React from 'react';
import { IonApp, IonSplitPane, IonPage } from '@ionic/react';
import './App.css';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import CollapsibleTable from "./containers/CollapsibleTable";

const App = () => (
    <Router>
        <div id="app">
            <IonApp>
                <IonSplitPane contentId="main">
                    <SideMenu/>
                    <IonPage id="main">
                        <Switch>
                            <Route exact path="/new" render={() => <CollapsibleTable title={`List of New Orders`} type={'new'}/>} />
                            <Route exact path="/inprogress" render={() => <CollapsibleTable title={`List of Orders being Processed`} type={'inprocess'} />} />
                            <Route exact path="/processed" render={() => <CollapsibleTable title={`List of Processed Orders`} type={'processed'}/>} />
                        </Switch>
                    </IonPage>
                </IonSplitPane>
            </IonApp>
        </div>
    </Router>
);


export default App;
