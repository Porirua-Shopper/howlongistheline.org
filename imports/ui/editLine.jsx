import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular } from 'react-onsenui'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import { locations } from '../api/lines.js';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

function EditLine({ history, details }) {

    if (!details) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
            </MainLayout>
        )
    }
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(details.status); //0:not selected


    function submit() {

        if (status == "0") {
            toast("How busy is it right now?");
            return
        }

        setLoading(true)
        Meteor.call('locations.update', details._id, status, function (err, result) {

            if (err) {
                setLoading(false)
                console.log(err)
                return
            }
            // setLoading(false)
            toast("Thank You!")
            history.push('/')
        });
    }
    if (loading) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
            </MainLayout>
        )
    }
    return (
        <MainLayout>
            <ListTitle>
                Status
            </ListTitle>
            {/* <Select modifier="material" modifier="nodivider"
                style={{ width: "80%", margin: 20 }}
                value={status}
                onChange={(event) => setStatus(event.target.value)}>
                <option value="0">How busy is it?</option>
                <option value="no">There's no line right now</option>
                <option value="small">Less than 5 people waiting</option>
                <option value="long">More than 5 people waiting</option>
            </Select> */}

            <FormControl component="fieldset" style={{ width: "80%", margin: 20 }}>
                <RadioGroup aria-label="gender" name="gender1" value={status} onChange={(event) => setStatus(event.target.value)}>
                    {/* <FormControlLabel value="0" control={<Radio />} label="How busy is it?" /> */}
                    <FormControlLabel value="no" control={<Radio />} label="There's no line right now" />
                    <FormControlLabel value="small" control={<Radio />} label="Less than 5 people waiting" />
                    <FormControlLabel value="long" control={<Radio />} label="More than 5 people waiting" />
                </RadioGroup>
            </FormControl>

            <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                // type="submit"
                onClick={() => {
                    submit()
                }}>
                Submit
                    <Icon style={{ marginLeft: 10 }} icon='fa-plus' />
            </Button>
        </MainLayout>
    )
}


export default withTracker(() => {
    Meteor.subscribe('locations');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    return {
        details: locations.findOne({ _id: id }),
    };
})(EditLine);
