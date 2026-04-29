<?php
/**
 * One-shot Motion.page timeline injector for the Belinus landing page.
 *
 * Run inside WordPress context:
 *   docker exec --user www-data <container> wp eval-file <path-to-this-file>
 *
 * Idempotent: safe to re-run; existing rows with the same script_name are
 * UPDATED in place (timeline edits) rather than duplicated.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit( "Run this via 'wp eval-file' inside WordPress context.\n" );
}

if ( ! function_exists( 'motionpage' ) ) {
	exit( "Motion.page plugin not loaded \u2014 abort.\n" );
}

global $wpdb;
$table_data = $wpdb->prefix . 'motionpage_data';
$table_code = $wpdb->prefix . 'motionpage_code';

/* Ensure tables exist (Motion.page creates them lazily). */
$exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_data ) );
if ( $exists !== $table_data ) {
	echo "Tables missing \u2014 creating via motionpage()->createTables()...\n";
	if ( method_exists( motionpage(), 'createTables' ) ) {
		motionpage()->createTables();
	} else {
		$charset = $wpdb->get_charset_collate();
		$wpdb->query( "CREATE TABLE IF NOT EXISTS {$table_data} (
			id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			script_name VARCHAR(191) NOT NULL,
			trigger_name VARCHAR(191) NOT NULL,
			reload LONGTEXT NOT NULL,
			PRIMARY KEY (id)
		) {$charset};" );
		$wpdb->query( "CREATE TABLE IF NOT EXISTS {$table_code} (
			id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			script_value LONGTEXT NOT NULL,
			generated_code LONGTEXT NULL,
			post_id BIGINT(20) NULL,
			is_global TINYINT(1) NOT NULL,
			is_active TINYINT(1) NOT NULL,
			plugins VARCHAR(191) NULL,
			types VARCHAR(191) NULL,
			cats VARCHAR(191) NULL,
			data_id BIGINT(20) UNSIGNED NOT NULL,
			PRIMARY KEY (id)
		) {$charset};" );
	}
}

/*
 * Each timeline = one IIFE wrapping its GSAP code so const declarations
 * don't collide across timelines. The plugin's frontend enqueuer wraps
 * all generated_code in a single DOMContentLoaded listener; ScrollTrigger
 * is auto-loaded when the code contains "crollTrigger".
 */
$timelines = array(

	/* 1. Hero entrance \u2014 page-specific */
	array(
		'script_name'    => 'Belinus \u2014 Hero entrance',
		'trigger_name'  => 'pageLoad',
		'post_id'        => 99,
		'is_global'      => 0,
		'is_active'      => 1,
		'plugins'        => '',
		'types'          => 'page',
		'cats'           => '',
		'reload'         => '{}',
		'script_value'   => '{"raw":true,"author":"belinus-injector","version":"1.3.0"}',
		'generated_code' => <<<'JS'
(()=>{
  if (typeof gsap === 'undefined') return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = gsap.utils.toArray(['.bl-hero__eyebrow','.bl-hero__subhead','.bl-hero__ctas','.bl-hero__trust']);
  if (!targets.length) return;
  if (reduceMotion) { gsap.set(targets, {opacity:1, y:0}); return; }
  gsap.set(targets, {opacity:0, y:16});
  gsap.to(targets, {opacity:1, y:0, duration:0.6, ease:'power2.out', stagger:0.08, delay:0.1});
})();
JS,
	),

	/* 2. Value-prop cards reveal \u2014 page-specific */
	array(
		'script_name'    => 'Belinus \u2014 Value-prop cards reveal',
		'trigger_name'  => 'scrollTrigger',
		'post_id'        => 99,
		'is_global'      => 0,
		'is_active'      => 1,
		'plugins'        => 'ScrollTrigger',
		'types'          => 'page',
		'cats'           => '',
		'reload'         => '{}',
		'script_value'   => '{"raw":true,"author":"belinus-injector","version":"1.3.0"}',
		'generated_code' => <<<'JS'
(()=>{
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = gsap.utils.toArray('#section-landing-valueprops .bl-valueprop-card');
  if (!cards.length) return;
  if (reduceMotion) { gsap.set(cards, {opacity:1, y:0}); return; }
  gsap.set(cards, {opacity:0, y:24});
  gsap.to(cards, {
    opacity:1, y:0, duration:0.5, ease:'power2.out', stagger:0.12,
    scrollTrigger: { trigger:'#section-landing-valueprops', start:'top 80%', toggleActions:'play none none reverse' }
  });
})();
JS,
	),

	/* 3. Stat counters scale-in \u2014 global */
	array(
		'script_name'    => 'Belinus \u2014 Stat counters scale-in',
		'trigger_name'  => 'scrollTrigger',
		'post_id'        => 0,
		'is_global'      => 1,
		'is_active'      => 1,
		'plugins'        => 'ScrollTrigger',
		'types'          => 'page',
		'cats'           => '',
		'reload'         => '{}',
		'script_value'   => '{"raw":true,"author":"belinus-injector","version":"1.3.0"}',
		'generated_code' => <<<'JS'
(()=>{
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stats = gsap.utils.toArray('.bl-proof__stats > .bl-stat-card');
  if (!stats.length) return;
  if (reduceMotion) { gsap.set(stats, {opacity:1, scale:1}); return; }
  gsap.set(stats, {opacity:0, scale:0.92});
  gsap.to(stats, {
    opacity:1, scale:1, duration:0.7, ease:'back.out(1.4)', stagger:0.15,
    scrollTrigger: { trigger:'.bl-proof__stats', start:'top 70%', toggleActions:'play none none reverse' }
  });
})();
JS,
	),

	/* 4. Accordion stagger \u2014 global */
	array(
		'script_name'    => 'Belinus \u2014 Accordion stagger',
		'trigger_name'  => 'scrollTrigger',
		'post_id'        => 0,
		'is_global'      => 1,
		'is_active'      => 1,
		'plugins'        => 'ScrollTrigger',
		'types'          => 'page',
		'cats'           => '',
		'reload'         => '{}',
		'script_value'   => '{"raw":true,"author":"belinus-injector","version":"1.3.0"}',
		'generated_code' => <<<'JS'
(()=>{
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = gsap.utils.toArray('#section-landing-specs .bl-accordion__item');
  if (!items.length) return;
  if (reduceMotion) { gsap.set(items, {opacity:1, x:0}); return; }
  gsap.set(items, {opacity:0, x:-12});
  gsap.to(items, {
    opacity:1, x:0, duration:0.4, ease:'power2.out', stagger:0.06,
    scrollTrigger: { trigger:'#section-landing-specs', start:'top 75%', toggleActions:'play none none reverse' }
  });
})();
JS,
	),

	/* 5. ROI savings pulse \u2014 global */
	array(
		'script_name'    => 'Belinus \u2014 ROI savings pulse',
		'trigger_name'  => 'pageLoad',
		'post_id'        => 0,
		'is_global'      => 1,
		'is_active'      => 1,
		'plugins'        => '',
		'types'          => 'page',
		'cats'           => '',
		'reload'         => '{}',
		'script_value'   => '{"raw":true,"author":"belinus-injector","version":"1.3.0"}',
		'generated_code' => <<<'JS'
(()=>{
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const target = document.querySelector('[data-out="savings"]');
  const sliders = document.querySelectorAll('.bl-roi-slider');
  if (!target || !sliders.length) return;
  sliders.forEach((slider) => {
    slider.addEventListener('input', () => {
      gsap.fromTo(target, {scale:1}, {scale:1.04, duration:0.12, yoyo:true, repeat:1, ease:'power2.out'});
    }, {passive: true});
  });
})();
JS,
	),

	/* 6. Footer fade \u2014 global */
	array(
		'script_name'    => 'Belinus \u2014 Footer fade',
		'trigger_name'  => 'scrollTrigger',
		'post_id'        => 0,
		'is_global'      => 1,
		'is_active'      => 1,
		'plugins'        => 'ScrollTrigger',
		'types'          => 'page',
		'cats'           => '',
		'reload'         => '{}',
		'script_value'   => '{"raw":true,"author":"belinus-injector","version":"1.3.0"}',
		'generated_code' => <<<'JS'
(()=>{
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cols = gsap.utils.toArray('#section-landing-footer .bl-footer__columns > div');
  if (!cols.length) return;
  if (reduceMotion) { gsap.set(cols, {opacity:1, y:0}); return; }
  gsap.set(cols, {opacity:0, y:12});
  gsap.to(cols, {
    opacity:1, y:0, duration:0.5, ease:'power2.out', stagger:0.1,
    scrollTrigger: { trigger:'#section-landing-footer', start:'top 90%', toggleActions:'play none none reverse' }
  });
})();
JS,
	),

);

/**
 * Insert/upsert each timeline. Match by script_name to make this idempotent.
 */
$inserted = 0;
$updated  = 0;

foreach ( $timelines as $tl ) {

	$existing_data_id = $wpdb->get_var( $wpdb->prepare(
		"SELECT id FROM {$table_data} WHERE script_name = %s LIMIT 1",
		$tl['script_name']
	) );

	if ( $existing_data_id ) {
		$wpdb->update( $table_data, array(
			'trigger_name' => $tl['trigger_name'],
			'reload'       => $tl['reload'],
		), array( 'id' => (int) $existing_data_id ) );

		$wpdb->update( $table_code, array(
			'script_value'   => $tl['script_value'],
			'generated_code' => $tl['generated_code'],
			'post_id'        => $tl['post_id'],
			'is_global'      => $tl['is_global'],
			'is_active'      => $tl['is_active'],
			'plugins'        => $tl['plugins'],
			'types'          => $tl['types'],
			'cats'           => $tl['cats'],
		), array( 'data_id' => (int) $existing_data_id ) );

		$updated++;
		printf( "  [UPDATE] data_id=%d  %s\n", (int) $existing_data_id, $tl['script_name'] );
		continue;
	}

	$wpdb->insert( $table_data, array(
		'script_name'  => $tl['script_name'],
		'trigger_name' => $tl['trigger_name'],
		'reload'       => $tl['reload'],
	) );
	if ( $wpdb->last_error ) {
		printf( "  [ERROR] data insert failed for %s: %s\n", $tl['script_name'], $wpdb->last_error );
		continue;
	}
	$new_data_id = (int) $wpdb->insert_id;

	$wpdb->insert( $table_code, array(
		'script_value'   => $tl['script_value'],
		'generated_code' => $tl['generated_code'],
		'post_id'        => $tl['post_id'],
		'is_global'      => $tl['is_global'],
		'is_active'      => $tl['is_active'],
		'plugins'        => $tl['plugins'],
		'types'          => $tl['types'],
		'cats'           => $tl['cats'],
		'data_id'        => $new_data_id,
	) );
	if ( $wpdb->last_error ) {
		printf( "  [ERROR] code insert failed for %s: %s\n", $tl['script_name'], $wpdb->last_error );
		$wpdb->delete( $table_data, array( 'id' => $new_data_id ) );
		continue;
	}

	$inserted++;
	printf( "  [INSERT] data_id=%d  %s\n", $new_data_id, $tl['script_name'] );
}

do_action( 'motionpage/action/api/create' );
if ( function_exists( 'wp_cache_flush' ) ) {
	wp_cache_flush();
}

printf( "\nResult: %d inserted, %d updated.\n", $inserted, $updated );

$rows = $wpdb->get_results(
	"SELECT d.id, d.script_name, d.trigger_name, c.is_global, c.is_active, c.post_id, c.plugins
	   FROM {$table_data} d
	   LEFT JOIN {$table_code} c ON c.data_id = d.id
	   ORDER BY d.id ASC",
	ARRAY_A
);
echo "\nCurrent state of wp_motionpage_data + wp_motionpage_code:\n";
foreach ( $rows as $r ) {
	printf(
		"  #%-3s  %-50s  trigger=%s  global=%d  active=%d  post=%s  plugins=%s\n",
		$r['id'],
		$r['script_name'],
		$r['trigger_name'],
		(int) $r['is_global'],
		(int) $r['is_active'],
		$r['post_id'] ?? 'null',
		$r['plugins'] ?? '-'
	);
}
echo "\nDone.\n";