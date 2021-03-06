<?php

/*
 * This file is part of the phpdish/phpdish
 *
 * (c) Slince <taosikai@yeah.net>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace PHPDish\Bundle\ThemeBundle\CacheWarmer;


use PHPDish\Bundle\ThemeBundle\Theming\ThemeManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Bundle\FrameworkBundle\CacheWarmer\TemplateFinderInterface;
use Symfony\Bundle\FrameworkBundle\CacheWarmer\TemplatePathsCacheWarmer as BaseTemplatePathsCacheWarmer;
use Symfony\Bundle\FrameworkBundle\Templating\Loader\TemplateLocator;
use Symfony\Component\Templating\TemplateReferenceInterface;

class TemplatePathsCacheWarmer extends BaseTemplatePathsCacheWarmer
{

    protected $themeManager;

    public function __construct(
        ThemeManagerInterface $themeManager,
        TemplateFinderInterface $finder,
        TemplateLocator $locator
    ) {
        parent::__construct($finder, $locator);
        $this->themeManager = $themeManager;
    }

    /**
     * {@inheritdoc}
     */
    public function warmUp($cacheDir)
    {

        /** @var TemplateReferenceInterface[] $allTemplates */
        $allTemplates = $this->finder->findAllTemplates();
        $filesystem = new Filesystem();
        $templates = array();

        // 不用主题
        $themes = $this->themeManager->getThemes();
        array_unshift($themes, null);
        foreach ($themes as $theme) {
            $keySuffix = $theme ? '|' . $theme->getName() : '';
            foreach ($allTemplates as $template) {
                $this->themeManager->setCurrentTheme($theme); //覆盖当前主题
                $key = $template->getLogicalName() . $keySuffix;
                $templates[$key]
                    = rtrim($filesystem->makePathRelative($this->locator->locate($template), $cacheDir), '/');
            }
        }

        $templates = str_replace("' => '", "' => __DIR__.'/", var_export($templates, true));
        $this->writeCacheFile($cacheDir.'/templates.php', sprintf("<?php return %s;\n", $templates));
    }

    /**
     * {@inheritdoc}
     */
    public function isOptional()
    {
        return true;
    }
}