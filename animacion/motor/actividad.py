#!/usr/bin/env python3
"""Control de calidad: mide cuánto cambia la imagen segundo a segundo y lista los tramos
de 3 s o más con poca novedad visual (donde "solo habla" la voz).
Uso: python3 animacion/motor/actividad.py renders/VIDEO.mp4 /tmp/actividad.npy
"""
import subprocess, sys, numpy as np
f=sys.argv[1]; fps=6; w,h=160,90
raw=subprocess.run(["ffmpeg","-v","error","-i",f,"-vf",f"fps={fps},scale={w}:{h},format=gray","-f","rawvideo","-"],capture_output=True,check=True).stdout
fr=np.frombuffer(raw,dtype=np.uint8).reshape(-1,h,w).astype(np.float32)
d=np.abs(np.diff(fr,axis=0)).mean(axis=(1,2))  # cambio promedio por cuadro
# actividad por segundo y "novedad" (cambio respecto a 2 s antes)
sec=len(d)//fps
act=np.array([d[i*fps:(i+1)*fps].mean() for i in range(sec)])
nov=np.array([np.abs(fr[min(len(fr)-1,(i+1)*fps)]-fr[max(0,(i-1)*fps)]).mean() for i in range(sec)])
np.save(sys.argv[2], np.stack([act,nov]))
low=[i for i in range(sec) if nov[i]<2.0]
print("segundos totales",sec,"segundos con poca novedad",len(low))
# rachas
runs=[];s=None
for i in range(sec+1):
    if i<sec and nov[i]<2.0:
        s=i if s is None else s
    elif s is not None:
        if i-s>=3: runs.append((s,i))
        s=None
print("rachas >=3s:", " ".join(f"{a//60}:{a%60:02d}-{b//60}:{b%60:02d}({b-a}s)" for a,b in runs))
