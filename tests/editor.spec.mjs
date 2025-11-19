import { test, expect } from '@playwright/test';
import { pageSchema as defaultSchema } from '../public_restored/page-schema.mjs';

// Obtener el valor original directamente desde el módulo importado
const heroSectionDefault = defaultSchema.find(s => s.type === 'hero');
const originalTitle = heroSectionDefault.content.hero_title;

test.describe('Pruebas Funcionales del Editor', () => {
    const newTitle = 'Título de Prueba Modificado';

    test('debería actualizar el título en vivo, guardarlo y restaurarlo', async ({ page }) => {
        await page.goto('/editor.html', { waitUntil: 'networkidle' });

        const iframe = page.frameLocator('#preview-iframe');
        const titleInPreview = iframe.locator('#hero-hero_title');

        // 1. Verificar el estado inicial
        await expect(titleInPreview).toHaveText(originalTitle);
        console.log('Verificación de estado inicial: ÉXITO');

        // 2. Localizar el campo de entrada y modificarlo
        const titleInput = page.locator('input[data-path="hero-hero_title"]');
        await titleInput.fill(newTitle);

        // 3. Verificar la actualización en vivo
        await expect(titleInPreview).toHaveText(newTitle);
        console.log('Verificación de actualización en vivo: ÉXITO');

        // 4. Probar la persistencia (Guardar)
        await page.click('#save-button');

        // Esperar a que el texto del botón vuelva a la normalidad en lugar de un timeout fijo
        await expect(page.locator('#save-button')).toHaveText('¡Guardado!');
        await expect(page.locator('#save-button')).toHaveText('Guardar y Recargar Vista Previa', { timeout: 2000 });

        await page.reload({ waitUntil: 'networkidle' });

        // 5. Verificar que el valor guardado se cargó después de recargar
        const titleInputAfterReload = page.locator('input[data-path="hero-hero_title"]');
        const titleInPreviewAfterReload = iframe.locator('#hero-hero_title');

        await expect(titleInputAfterReload).toHaveValue(newTitle);
        await expect(titleInPreviewAfterReload).toHaveText(newTitle);
        console.log('Verificación de persistencia tras guardar y recargar: ÉXITO');

        // 6. Probar la restauración
        page.on('dialog', dialog => dialog.accept()); // Aceptar el diálogo de confirmación
        await page.click('#reset-button');

        // Esperar a que la navegación post-reseteo termine
        await page.waitForNavigation({ waitUntil: 'networkidle' });

        // 7. Verificar que los valores han vuelto al estado original
        const titleInputAfterReset = page.locator('input[data-path="hero-hero_title"]');
        const titleInPreviewAfterReset = iframe.locator('#hero-hero_title');

        await expect(titleInputAfterReset).toHaveValue(originalTitle);
        await expect(titleInPreviewAfterReset).toHaveText(originalTitle);
        console.log('Verificación de restauración a valores por defecto: ÉXITO');
    });
});
