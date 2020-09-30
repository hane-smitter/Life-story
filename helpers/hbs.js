const moment = require('moment');

module.exports= {
    formatDate: function( date, format ) {
        let dateFormat;
        if(!format) {
            dateFormat = moment(date).calendar();
        } else {

            dateFormat = moment(date).format(format);
        }
        return dateFormat;
        
    },
    stripTags: function( body ) {
        let filtered;
        if(body) {
            filtered = body.replace(/<[/]?(script|body|html|article)? *>/gim, '');
        }
        return body;
    },
    truncate: function( str, len ) {
        if( str.length > len ) {
            var new_str = str.substr(0, len);
            new_str = new_str.substr(0, new_str.lastIndexOf(' '));
            new_str = new_str + ' ...';
            return new_str;
        }
        return str;
    },
    editIcon: function(storyCreator, authUser, storyId, floating = true) {
        if(storyCreator._id.toString() == authUser._id.toString()) {
            if(floating) {
                return `
                <a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue">
                    <i class="fas fa-edit fa-small"></i>
                </a>
                `;
            }
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit fa-small"></i></a>`
        }
        return
    },
    editStoryStatus: function( status ) {
        const whichStatus = status === 'private';
        if( whichStatus ) {
            return (`
                <option value="private" selected>private</option>
                <option value="public">public</option>
            `);
        }
        return (`
            <option value="private">private</option>
            <option value="public" selected>public</option>
        `);
    },
    writeTracker: (created, updated) => {
        if(created === updated) {
            return `<span class="card-title"><small>created: </small>${moment(created).calendar()}</span>`;
        }
       return ` <span class="card-title"><small>created: </small>${moment(created).calendar()}</span>
        <span class="card-title"><small>updated: </small>${moment(updated).calendar()}</span>`
    }
}