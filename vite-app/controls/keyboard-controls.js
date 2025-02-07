import { useEffect, useRef } from 'react'

function useKeyControls(
    { current },
map,
) {
    useEffect(() => {
        const handleKeydown = ({ key }) => {
            if (!isKeyCode(key)) return
            current[map[key]] = true
        }
        window.addEventListener('keydown', handleKeydown)
        const handleKeyup = ({ key }) => {
            if (!isKeyCode(key)) return
            current[map[key]] = false
        }
        window.addEventListener('keyup', handleKeyup)
        return () => {
            window.removeEventListener('keydown', handleKeydown)
            window.removeEventListener('keyup', handleKeyup)
        }
    }, [current, map])
}

const keyControlMap = {
    ' ': 'brake',
    ArrowDown: 'backward',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'forward',
    a: 'left',
    d: 'right',
    r: 'reset',
    s: 'backward',
    w: 'forward',
}



const keyCodes = Object.keys(keyControlMap)
const isKeyCode = (v)=> keyCodes.includes(v)

export function useControls() {
    const controls = useRef({
        backward: false,
        brake: false,
        forward: false,
        left: false,
        reset: false,
        right: false,
    })

    useKeyControls(controls, keyControlMap)

    return controls
}