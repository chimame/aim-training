import React, { useState, useEffect } from 'react'
import { Layer } from 'react-konva'
import { map, random } from 'lodash'

import { Stage } from 'react-konva'
import Target from '../components/Target'

type TargetObj = {
  x: number,
  y: number,
  enable: boolean,
}

type State = {
  w: number,
  h: number,
  targets: { [i: number]: TargetObj },
}

const RandStage = () => {
  const defaultState = {
    w: 0,
    h: 0,
    targets: {
      0: { x: 0, y: 0, enable: true },
      1: { x: 0, y: 0, enable: true },
      2: { x: 0, y: 0, enable: true },
    },
  }

  const [state, setState] = useState<State>(defaultState)

  const updateDimensions = (width: number, height: number) => {
    setState({
      w: width,
      h: height,
      targets: {
        0: { x: width * 0.2, y: height * 0.5, enable: true },
        1: { x: width * 0.5, y: height * 0.2, enable: true },
        2: { x: width * 0.5, y: height * 0.8, enable: true },
      },
    })
  }

  useEffect(() => {
    const resizeHandler = () => updateDimensions(window.innerWidth, window.innerHeight)
    resizeHandler()
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  const { h, w, targets } = state
  return (
    <Stage width={w} height={h}>
      <Layer>
        {map(targets, (t, i) => (
          <Target
            key={i}
            x={t.x}
            y={t.y}
            handleHit={() => {
              setState({
                ...state,
                targets: {
                  ...targets,
                  [i]: {
                    ...targets[i],
                    x: w * random(0.2, 0.8),
                    y: h * random(0.2, 0.8),
                  },
                },
              })
            }}
            enable={t.enable}
            colIn={'#fdf'}
            colOu={'#a0f'}
          />
        ))}
      </Layer>
    </Stage>
  )
}

export default RandStage