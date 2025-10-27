import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const CameraDebug = () => {
  const [status, setStatus] = useState<string>("Prêt à tester");
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const checkCamera = async () => {
    setLogs([]);
    setLoading(true);
    
    addLog("🔍 Vérification de la disponibilité de l'API...");
    
    if (!navigator.mediaDevices) {
      setStatus("❌ API MediaDevices non disponible");
      addLog("❌ navigator.mediaDevices n'existe pas");
      setLoading(false);
      return;
    }
    
    addLog("✅ API MediaDevices disponible");
    
    if (!navigator.mediaDevices.getUserMedia) {
      setStatus("❌ getUserMedia non supporté");
      addLog("❌ navigator.mediaDevices.getUserMedia n'existe pas");
      setLoading(false);
      return;
    }
    
    addLog("✅ getUserMedia disponible");
    addLog("🔍 Énumération des appareils...");
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      addLog(`📹 Total appareils: ${devices.length}`);
      
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      addLog(`📹 Caméras vidéo: ${videoDevices.length}`);
      
      if (videoDevices.length === 0) {
        setStatus("❌ Aucune caméra détectée");
        addLog("❌ Aucun appareil videoinput trouvé");
        setLoading(false);
        return;
      }
      
      videoDevices.forEach((device, i) => {
        addLog(`  Caméra ${i + 1}: ${device.label || 'Sans nom'}`);
        addLog(`    ID: ${device.deviceId.substring(0, 20)}...`);
      });
      
      setStatus(`✅ ${videoDevices.length} caméra(s) détectée(s)`);
      
    } catch (error: any) {
      setStatus("⚠️ Erreur d'énumération");
      addLog(`❌ Erreur: ${error.message}`);
    }
    
    setLoading(false);
  };

  const testCamera = async () => {
    setLogs([]);
    setLoading(true);
    
    addLog("🎥 Demande d'accès à la caméra...");
    
    try {
      const constraints = { video: true };
      addLog(`📋 Contraintes: ${JSON.stringify(constraints)}`);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      addLog("✅ Stream obtenu!");
      
      const tracks = stream.getVideoTracks();
      addLog(`📹 Pistes vidéo: ${tracks.length}`);
      
      tracks.forEach((track, i) => {
        addLog(`  Piste ${i + 1}: ${track.label}`);
        addLog(`    État: ${track.readyState}`);
        addLog(`    Activée: ${track.enabled}`);
        
        const settings = track.getSettings();
        addLog(`    Résolution: ${settings.width}x${settings.height}`);
        addLog(`    FrameRate: ${settings.frameRate}`);
      });
      
      if (videoRef.current) {
        addLog("📺 Attachement au élément vidéo...");
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        
        try {
          await videoRef.current.play();
          addLog("✅ Vidéo en lecture!");
          setCameraActive(true);
          setStatus("✅ Caméra fonctionne!");
        } catch (playError: any) {
          addLog(`❌ Erreur de lecture: ${playError.message}`);
          setStatus(`❌ Erreur lecture: ${playError.message}`);
        }
      }
      
    } catch (error: any) {
      addLog(`❌ ERREUR: ${error.name}`);
      addLog(`   Message: ${error.message}`);
      setStatus(`❌ ${error.name}: ${error.message}`);
      
      let solution = "";
      switch(error.name) {
        case 'NotAllowedError':
          solution = "Vous avez refusé l'accès. Cliquez sur l'icône de caméra dans la barre d'adresse pour autoriser.";
          break;
        case 'NotFoundError':
          solution = "Aucune caméra trouvée. Vérifiez qu'une caméra est connectée.";
          break;
        case 'NotReadableError':
          solution = "Caméra déjà utilisée par une autre application.";
          break;
        case 'SecurityError':
          solution = "Erreur de sécurité. Utilisez HTTPS ou localhost.";
          break;
      }
      
      if (solution) {
        addLog(`💡 Solution: ${solution}`);
      }
    }
    
    setLoading(false);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        addLog(`🛑 Arrêt de: ${track.label}`);
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setStatus("Caméra arrêtée");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🔧 Diagnostic de Caméra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className={`p-4 rounded-lg border-2 ${
              status.includes('✅') ? 'bg-green-50 border-green-200' :
              status.includes('❌') ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <p className="font-semibold">{status}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={checkCamera} disabled={loading} variant="outline">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                Vérifier Disponibilité
              </Button>
              
              <Button onClick={testCamera} disabled={loading || cameraActive}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                Tester Caméra
              </Button>
              
              {cameraActive && (
                <Button onClick={stopCamera} variant="destructive">
                  Arrêter
                </Button>
              )}
            </div>

            {/* Video */}
            {cameraActive && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-black"
                />
              </div>
            )}

            {/* Logs */}
            {logs.length > 0 && (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">{log}</div>
                ))}
              </div>
            )}

            {/* Browser Info */}
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Navigateur:</strong> {navigator.userAgent}<br />
                  <strong>URL:</strong> {window.location.href}<br />
                  <strong>Protocol:</strong> {window.location.protocol}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1.</strong> Cliquez sur "Vérifier Disponibilité" pour voir si des caméras sont détectées</p>
            <p><strong>2.</strong> Si des caméras sont trouvées, cliquez sur "Tester Caméra"</p>
            <p><strong>3.</strong> Autorisez l'accès quand votre navigateur vous le demande</p>
            <p><strong>4.</strong> La vidéo devrait s'afficher</p>
            <p className="text-muted-foreground pt-2">💡 Consultez les logs en bas pour voir les détails techniques</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CameraDebug;
