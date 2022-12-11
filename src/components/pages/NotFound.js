import { NavLink } from 'react-router-dom';

function NotFound(){
    return (
        <div>
            <text>Oh somithing went wrong, page not found</text>
            <div>
                <button><NavLink to="/" exact>Home</NavLink></button>
            </div>
        </div>
    )
}

export default NotFound; 