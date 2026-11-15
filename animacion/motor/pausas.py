import subprocess, sys, numpy as np
SR=16000
def load(p):
    raw=subprocess.run(["ffmpeg","-v","error","-i",p,"-f","f32le","-ac","1","-ar",str(SR),"-"],capture_output=True,check=True).stdout
    return np.frombuffer(raw,dtype=np.float32)
def pauses(p, rel=-32, mind=0.22):
    x=load(p); hop=int(0.02*SR)
    e=np.array([np.sqrt(np.mean(x[i:i+hop]**2)+1e-12) for i in range(0,len(x)-hop,hop)])
    db=20*np.log10(e/e.max())
    q=db<rel; out=[]; i=0
    while i<len(q):
        if q[i]:
            j=i
            while j<len(q) and q[j]: j+=1
            if (j-i)*0.02>=mind: out.append((round(i*0.02,2),round(j*0.02,2)))
            i=j
        else: i+=1
    return out, len(x)/SR
if __name__=="__main__":
    for p in sys.argv[1:]:
        ps,d=pauses(p); print(p, round(d,1), len(ps)); print(" ".join(f"{a}-{b}" for a,b in ps))
