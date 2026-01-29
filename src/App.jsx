// src/App.jsx
import { AuthProvider } from "./contexts/AuthContext";
import { EmpresaProvider } from "./contexts/EmpresaContext";
import { AtivoProvider } from "./contexts/AtivoContext";
import { MovimentacaoProvider } from "./contexts/MovimentacaoContext";
import { InvestimentosProvider } from "./contexts/InvestimentosContext";
import { CDIProvider } from "./contexts/CDIContext";
import { DominioProvider } from "./contexts/DominioContext";

import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <EmpresaProvider>
        <AtivoProvider>
          <MovimentacaoProvider>
            <CDIProvider>
              <DominioProvider>
                <InvestimentosProvider>
                  <AppRouter />
                </InvestimentosProvider>
              </DominioProvider>
            </CDIProvider>
          </MovimentacaoProvider>
        </AtivoProvider>
      </EmpresaProvider>
    </AuthProvider>
  );
}
