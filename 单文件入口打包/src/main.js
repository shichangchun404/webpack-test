const greeter = require('./components/greeter');
import reset from '@/static/css/reset.css'
require('@/static/css/color')

import {eat} from "./components/hi";


document.querySelector("#root").appendChild(greeter());
eat()