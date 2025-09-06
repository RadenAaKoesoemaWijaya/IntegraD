
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Bell, Thermometer, Wind } from 'lucide-react';

// Mock data for potential outbreaks
const potentialOutbreaks = [
  { id: 1, disease: 'Demam Berdarah', potentialOutbreak: 'Tinggi', riskLevel: 'Tinggi', status: 'Investigasi' },
  { id: 2, disease: 'Chikungunya', potentialOutbreak: 'Sedang', riskLevel: 'Sedang', status: 'Pemantauan' },
  { id: 3, disease: 'Leptospirosis', potentialOutbreak: 'Rendah', riskLevel: 'Rendah', status: 'Terkendali' },
];

// Mock data for IoT devices
const iotDevices = [
  { id: 1, name: 'Sensor Suhu', status: 'Aktif', value: '32°C' },
  { id: 2, name: 'Sensor Kelembaban', status: 'Aktif', value: '85%' },
  { id: 3, name: 'Perangkap Nyamuk Cerdas', status: 'Tidak Aktif', value: 'N/A' },
];

export function SurveillancePage({ dictionary }: { dictionary: any }) {
  const [showEarlyWarning, setShowEarlyWarning] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{dictionary.surveillance.title}</h1>
      <p className="text-gray-600 mb-8">{dictionary.surveillance.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.surveillance.iotIntegration}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{dictionary.surveillance.iotDescription}</p>
            <div className="space-y-4">
              {iotDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center">
                    {device.name.includes('Suhu') ? <Thermometer className="w-6 h-6 mr-2 text-red-500" /> : <Wind className="w-6 h-6 mr-2 text-blue-500" />}
                    <span>{device.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${device.status === 'Aktif' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                      {device.status}
                    </span>
                    <span className="ml-4 font-semibold">{device.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dictionary.surveillance.earlyWarning}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{dictionary.surveillance.earlyWarningDescription}</p>
            <Button onClick={() => setShowEarlyWarning(!showEarlyWarning)}>
              <Bell className="w-5 h-5 mr-2" />
              {showEarlyWarning ? 'Sembunyikan Peringatan' : 'Tampilkan Peringatan Aktif'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {showEarlyWarning && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{dictionary.earlyWarning.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{dictionary.earlyWarning.description}</p>
            <div className="space-y-4">
              {potentialOutbreaks.map((outbreak) => (
                <div key={outbreak.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{outbreak.disease}</h3>
                      <p className="text-sm text-gray-500">{dictionary.surveillance.riskLevel}: {outbreak.riskLevel}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${outbreak.potentialOutbreak === 'Tinggi' ? 'text-red-500' : 'text-yellow-500'}`}>{outbreak.potentialOutbreak}</p>
                      <p className="text-sm text-gray-500">{outbreak.status}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                     <Button variant="outline">{dictionary.earlyWarning.acknowledge}</Button>
                     <Button>{dictionary.earlyWarning.escalate}</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Pemantauan Surveilans Penyakit</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2">{dictionary.surveillance.disease}</th>
                <th className="pb-2">{dictionary.surveillance.potentialOutbreak}</th>
                <th className="pb-2">{dictionary.surveillance.riskLevel}</th>
                <th className="pb-2">{dictionary.surveillance.status}</th>
                <th className="pb-2">{dictionary.surveillance.action}</th>
              </tr>
            </thead>
            <tbody>
              {potentialOutbreaks.map((outbreak) => (
                <tr key={outbreak.id} className="border-b">
                  <td className="py-2">{outbreak.disease}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${outbreak.potentialOutbreak === 'Tinggi' ? 'bg-red-200 text-red-800' : outbreak.potentialOutbreak === 'Sedang' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                      {outbreak.potentialOutbreak}
                    </span>
                  </td>
                  <td className="py-2">{outbreak.riskLevel}</td>
                  <td className="py-2">{outbreak.status}</td>
                  <td className="py-2">
                    <Button variant="outline" size="sm">{dictionary.surveillance.viewDetails}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

